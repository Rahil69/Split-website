// shortcut: the whole "server" is one localStorage blob, so every user lives in this browser.
// Move to Supabase (users, friendships, splits, debts, notifications tables) for real multi-device use.
const KEY = "split.db.v4";
const SESSION_KEY = "split.session";

export const cents = (n) => Math.round(Number(n) * 100) / 100;

export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const uid = () => Math.random().toString(36).slice(2, 10);
const DAY = 86400000;

export const seed = (now = Date.now()) => ({
  // Demo accounts: [username, name, salt, sha256(salt + password)]. Passwords were sent to the owner.
  users: [
    ["raahil", "Raahil", "4512cdfd92f530bf", "fc8f2e8895da842741d759bd2ef41117e3971e4af80b3484a28408773a10016b"],
    ["ali", "Ali", "bfc560b939c5a129", "eed73bc3ed90f11488a1d801564f4ab2b7d3fb62c0584367eb4c40fd4a621358"],
    ["sara", "Sara", "a05b48dec3936b1e", "86cab6fee4bfa1e520b93e93b9f09041ee3855f2591252fed1d46bda6bad6b23"],
    ["yazak", "Yazak", "34708b1020afe514", "762fcc3d685996f936cdd4b624f8d991e5fdc3fa3855246966afa64dbacb5e1d"],
    ["hafiz", "Hafiz", "a3833388c71bb7ed", "3619c8539414bcba8d651ea73d6d1631c4e0cb7928f5908ac3354df8f3154c5c"],
    ["dhaisam", "Dhaisam", "082bfc875a7c2314", "2a2408b8bfbd2ea8cefc2a345ae5ec5e6bad045cc33032c841aa52ce68916038"],
    ["zareef", "Zareef", "6413fb6df56a35ba", "6da8ed4b08860381a9656347ad69e96f2314d49d31f9d1cb1bdae844c5d43c35"],
    ["aishath", "Aishath", "90edcdc89c9f3dea", "700e46128d21bd589f7ffc9d45a8c1467ff9460da757ff554e5170df64e88d9c"],
    ["ibrahim", "Ibrahim", "2d065dad4b7d872e", "96a8306e86d0a5295f55f2c90e20b89a8e6646fcd521ec0fff4c2e12cb5c54d7"],
    ["mariyam", "Mariyam", "fed55f5b1fe5cef7", "6186d14e35107d0aee8dc0299a3ff54995c5f96d5eaa6f2921925c5b0983faf7"],
    ["hussain", "Hussain", "58b5ad3e48a5ac92", "7eec3b342f590b7f5eac0ee3a43bbfe3706c29b4564752e27b498c23fad37cf4"],
    ["fathimath", "Fathimath", "c9380c6f64745506", "9d6c38ee49c1a1a0471d9e0eb3e72801616b7f7d9c4bcf50d605d31a5888dd16"],
    ["ahmed", "Ahmed", "9d28bdb004fde239", "a94f53ef156d8dd919dfb92c969b2868c745f0792ac48f8cb8452c61f0145779"],
    ["shifa", "Shifa", "db3aa676a80ac6c7", "e60aadf444ad70c0acefcea355e972a48b9291ca08bb945859f66e14421999b4"],
    ["nashid", "Nashid", "565ab2f26fda1305", "fb5008737d3c0f13a8b19b6d192c5087c071d17e31b06edc20956b15a317b264"],
  ].map(([id, name, salt, hash]) => ({ id, name, salt, hash, created: now - 30 * DAY })),
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

export const loadSession = () => {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

export const saveSession = (id) => {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore, same as save()
  }
};

// ---- accounts ----
// shortcut: hashing in the browser only keeps plain passwords out of storage; anyone with the
// device can still edit localStorage. Real auth needs a server (e.g. Supabase Auth).

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export const hashPassword = async (password, salt) =>
  hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + password)));

const newSalt = () => hex(crypto.getRandomValues(new Uint8Array(8)));

export const userProblem = (username) =>
  /^[a-z0-9_]{3,20}$/.test(username) ? null : "Usernames are 3–20 lowercase letters, numbers or _.";

export const passwordProblem = (password) =>
  password.length >= 6 ? null : "Passwords need at least 6 characters.";

export const signIn = async (db, username, password) => {
  const u = db.users.find((x) => x.id === username.trim().toLowerCase());
  return u && (await hashPassword(password, u.salt)) === u.hash ? u.id : null;
};

export const signUp = async (db, { username, name, password }, now = Date.now()) => {
  const id = username.trim().toLowerCase();
  const error =
    userProblem(id) ||
    (db.users.some((u) => u.id === id) && "That username is taken.") ||
    (!name.trim() && "Enter your name.") ||
    passwordProblem(password);
  if (error) return { error };
  const salt = newSalt();
  const user = { id, name: name.trim(), salt, hash: await hashPassword(password, salt), created: now };
  return { db: { ...db, users: [...db.users, user] } };
};

export const rename = (db, id, name) => ({
  ...db,
  users: db.users.map((u) => (u.id === id ? { ...u, name: name.trim() } : u)),
});

export const changePassword = async (db, id, current, next) => {
  const u = db.users.find((x) => x.id === id);
  if ((await hashPassword(current, u.salt)) !== u.hash) return { error: "Current password is wrong." };
  const error = passwordProblem(next);
  if (error) return { error };
  const salt = newSalt();
  const hash = await hashPassword(next, salt);
  return { db: { ...db, users: db.users.map((x) => (x.id === id ? { ...x, salt, hash } : x)) } };
};

// Refuses while money is still owed either way, so nobody loses track of a debt.
export const deleteAccount = (db, id) => {
  if (balances(db.debts, id).people.length) return { error: "Settle up with everyone before deleting your account." };
  return {
    db: {
      ...db,
      users: db.users.filter((u) => u.id !== id),
      friendships: db.friendships.filter((f) => f.from !== id && f.to !== id),
      notifications: db.notifications.filter((n) => n.to !== id),
    },
  };
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
