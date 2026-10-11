// shortcut: the whole "server" is one localStorage blob, so every user lives in this browser.
// Move to Supabase (users, friendships, splits, debts, notifications tables) for real multi-device use.
const KEY = "split.db.v3";
const ME_KEY = "split.me";

export const cents = (n) => Math.round(Number(n) * 100) / 100;

export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const uid = () => Math.random().toString(36).slice(2, 10);
const DAY = 86400000;

export const seed = (now = Date.now()) => ({
  users: [
    "Raahil", "Ali", "Sara", "Yazak", "Hafiz", "Dhaisam", "Zareef",
    "Aishath", "Ibrahim", "Mariyam", "Hussain", "Fathimath", "Ahmed", "Shifa", "Nashid",
  ].map((name) => ({
    id: name.toLowerCase(),
    name,
  })),
  friendships: [
    { from: "raahil", to: "ali", status: "accepted" },
    { from: "sara", to: "raahil", status: "accepted" },
    { from: "raahil", to: "yazak", status: "accepted" },
    { from: "ali", to: "sara", status: "accepted" },
    ...["aishath", "ibrahim", "mariyam", "hussain", "ahmed", "shifa", "nashid"].map((to) => ({
      from: "raahil",
      to,
      status: "accepted",
    })),
    { from: "hafiz", to: "raahil", status: "pending" },
  ],
  splits: [
    { id: "s1", by: "yazak", place: "Sea House", bill: 480, share: 160, people: ["yazak", "raahil", "ali"], date: now - DAY },
  ],
  debts: [{ id: "d1", from: "raahil", to: "yazak", amount: 160, place: "Sea House", date: now - DAY }],
  notifications: [
    { id: "n1", to: "raahil", text: "You borrowed 160.00 MVR from Yazak at Sea House", go: "Balances", date: now - DAY, read: false },
    { id: "n2", to: "raahil", text: "Hafiz sent you a friend request", go: "Friends", date: now - DAY / 2, read: false },
  ],
});

export const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || seed();
  } catch {
    return seed();
  }
};

export const save = (db) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // storage blocked (private mode): changes just won't persist
  }
};

export const loadMe = () => {
  try {
    return localStorage.getItem(ME_KEY) || "raahil";
  } catch {
    return "raahil";
  }
};

export const saveMe = (id) => {
  try {
    localStorage.setItem(ME_KEY, id);
  } catch {
    // ignore, same as save()
  }
};

export const nameOf = (db, id) => db.users.find((u) => u.id === id)?.name ?? "Someone";

const notify = (db, to, text, go = null, date = Date.now()) => ({
  ...db,
  notifications: [{ id: uid(), to, text, go, date, read: false }, ...db.notifications],
});

export const unread = (db, me) => db.notifications.filter((n) => n.to === me && !n.read).length;

export const markRead = (db, me) => ({
  ...db,
  notifications: db.notifications.map((n) => (n.to === me ? { ...n, read: true } : n)),
});

// ---- friends ----

export const friendship = (db, a, b) =>
  db.friendships.find((f) => (f.from === a && f.to === b) || (f.from === b && f.to === a));

export const friendsOf = (db, me) =>
  db.friendships
    .filter((f) => f.status === "accepted" && (f.from === me || f.to === me))
    .map((f) => (f.from === me ? f.to : f.from));

export const sendRequest = (db, me, to) => {
  if (me === to || friendship(db, me, to)) return db;
  db = { ...db, friendships: [...db.friendships, { from: me, to, status: "pending" }] };
  return notify(db, to, `${nameOf(db, me)} sent you a friend request`, "Friends");
};

export const respond = (db, me, from, accept) => {
  const rest = db.friendships.filter((f) => !(f.from === from && f.to === me && f.status === "pending"));
  if (!accept) return { ...db, friendships: rest };
  db = { ...db, friendships: [...rest, { from, to: me, status: "accepted" }] };
  return notify(db, from, `${nameOf(db, me)} accepted your friend request`, "Friends");
};

// ---- splits and debts ----

// What someone borrowed; a blank amount means they borrowed their whole share.
export const borrowed = (p, share) =>
  p.borrowedFrom === null ? 0 : cents(p.amount === "" ? share : p.amount);

// Whoever borrowed owes the person who covered them.
export const debtsFromSplit = ({ people, place, share }, date = Date.now()) =>
  people
    .filter((p) => borrowed(p, share) > 0)
    .map((p, i) => ({
      id: `${date}-${i}`,
      from: p.id,
      to: p.borrowedFrom,
      amount: borrowed(p, share),
      place,
      date,
    }));

export const saveSplit = (db, me, draft, date = Date.now()) => {
  const debts = debtsFromSplit(draft, date);
  db = {
    ...db,
    debts: [...debts, ...db.debts],
    splits: [
      {
        id: `${date}`,
        by: me,
        place: draft.place,
        bill: cents(draft.bill),
        share: draft.share,
        people: draft.people.map((p) => p.id),
        date,
      },
      ...db.splits,
    ],
  };
  const where = draft.place ? ` at ${draft.place}` : "";
  for (const d of debts) {
    // whoever entered the split already knows; tell everyone else involved
    if (d.from !== me)
      db = notify(db, d.from, `You borrowed ${money(d.amount)} MVR from ${nameOf(db, d.to)}${where}`, "Balances", date);
    if (d.to !== me)
      db = notify(db, d.to, `${nameOf(db, d.from)} borrowed ${money(d.amount)} MVR from you${where}`, "Balances", date);
  }
  return db;
};

// Net per person from my point of view: positive = they owe me, negative = I owe them.
export const balances = (debts, me) => {
  const net = {};
  for (const d of debts) {
    if (d.to === me) net[d.from] = (net[d.from] || 0) + d.amount;
    else if (d.from === me) net[d.to] = (net[d.to] || 0) - d.amount;
  }
  const people = Object.entries(net)
    .map(([id, amount]) => ({ id, amount: cents(amount) }))
    .filter((p) => p.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  const owed = cents(people.filter((p) => p.amount > 0).reduce((s, p) => s + p.amount, 0));
  const owe = cents(-people.filter((p) => p.amount < 0).reduce((s, p) => s + p.amount, 0));
  return { people, owed, owe, net: cents(owed - owe) };
};

export const settle = (db, me, other) =>
  notify(
    {
      ...db,
      debts: db.debts.filter(
        (d) => !((d.from === me && d.to === other) || (d.to === me && d.from === other)),
      ),
    },
    other,
    `${nameOf(db, me)} marked your balance as settled`,
    "Balances",
  );

export const remind = (db, me, other, amount) =>
  notify(db, other, `${nameOf(db, me)} reminded you that you owe them ${money(amount)} MVR`, "Balances");
