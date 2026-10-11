// shortcut: the whole "server" is one localStorage blob, so every user lives in this browser.
// Move to Supabase (users, friendships, splits, debts, notifications tables) for real multi-device use.
const KEY = "split.db.v5";
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
  // Demo accounts: [username, name, salt, sha256(salt + password)]. Every demo password is "password".
  users: [
    ["raahil", "Raahil", "0ac274858ab0a55c", "71f84fca8d6748b729fc6f295c31ca7a96bc75f263d4fa7affe36da71b66ab53"],
    ["ali", "Ali", "b4b0ff4e77eb010e", "c69d19502b01500478dd82ce0569a4d4f54ef15bc3aa314ebaef77d51a6699bc"],
    ["sara", "Sara", "ca5d1256f256752c", "cdf32772dfe0445b14b75057a968fb0fdded9244f01643a19df305832a12bbc9"],
    ["yazak", "Yazak", "b45a375f1bb2d172", "4c22ce4043d1c8780f5a206fdae2e2adcfc510b310e2a367ff3a46f0ed3c4d77"],
    ["hafiz", "Hafiz", "1911821a8ca85acc", "89f09ff38c52047a539366ecd2cbccfee1bc25c72d39f9da67ee9f3e60b9097a"],
    ["dhaisam", "Dhaisam", "c651584654eaaa5f", "f3679e346494b3e588cfd8cce1d9942d871fba87ab2496334835bf50006db2da"],
    ["zareef", "Zareef", "43f86c4d3f74a91e", "58777581f9ddb0afaa89063b969ae7d284454ededab79ce499dd68becf6fbdba"],
    ["aishath", "Aishath", "220cceb72587e192", "cd506034c0ac22271c9a61cbcc27a82abd6286a245800f489262cc8777c607d1"],
    ["ibrahim", "Ibrahim", "27fe91b3dc774901", "db55047d189613501e8fa2fdc432cd1065ac23df45e1bd40b8d8b982cdf8a367"],
    ["mariyam", "Mariyam", "845ace7d20cc31e4", "c10207e123eca94b699dea85a350d0b4b68d3a33d242e4b4c168943c1ad94cf1"],
    ["hussain", "Hussain", "a410e2aecbf7dbae", "b44c7d35fb9ed3f5823d956f98cd504b78cafe4af5e1f616dd42572ce3f743a7"],
    ["fathimath", "Fathimath", "ab764b5e42a2a336", "f2ede783188741f91811c8c6beeda067d90984e5c91d77008d17989f878e5b8e"],
    ["ahmed", "Ahmed", "5ab908b71109cb18", "57ca95d406cc840afd46b3095bac9b71b86a799240a76c0252f4f9e280570bc2"],
    ["shifa", "Shifa", "54f1e46ec115e9d5", "8ab39de621f52cdcd9f8139ca805e1978f3a0ae6374271637789ca44e22f1f81"],
    ["nashid", "Nashid", "03eda7a89a21c778", "17d8e74b8a13c127ff84379b396a0c035f7b73ff92d9a4835e9bb3c51db55718"],
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

// Marks one notification read, or all of mine when no id is given
export const markRead = (db, me, id = null) => ({
  ...db,
  notifications: db.notifications.map((n) => (n.to === me && (!id || n.id === id) ? { ...n, read: true } : n)),
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
