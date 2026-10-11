// Run: node src/lib/db.test.js
import assert from "node:assert/strict";
import {
  balances,
  debtsFromSplit,
  sharesOf,
  splitProblem,
  friendsOf,
  markRead,
  respond,
  saveSplit,
  changePassword,
  deleteAccount,
  seed,
  signIn,
  signUp,
  sendRequest,
  settle,
  unread,
} from "./db.js";

// splits: equal shares, custom shares, payer owed by everyone else, validation
const draft = (over) => ({
  bill: "300",
  place: "Cafe",
  payer: "a",
  mode: "equal",
  people: [{ id: "a", amount: "" }, { id: "b", amount: "" }, { id: "c", amount: "" }],
  ...over,
});
assert.deepEqual(sharesOf(draft({ bill: "100" })), { a: 33.33, b: 33.33, c: 33.33 });
assert.deepEqual(debtsFromSplit(draft(), 1).map((d) => [d.from, d.to, d.amount]), [["b", "a", 100], ["c", "a", 100]]);
// custom: friends' typed amounts, payer covers the rest (blank = 0), so it always adds up
const custom = draft({ mode: "custom", people: [{ id: "a", amount: "999" }, { id: "b", amount: "200" }, { id: "c", amount: "" }] });
assert.equal(splitProblem(custom), null);
assert.deepEqual(sharesOf(custom), { a: 100, b: 200, c: 0 }); // payer's own typed 999 is ignored
assert.deepEqual(debtsFromSplit(custom, 1).map((d) => [d.from, d.amount]), [["b", 200]]); // c owes nothing
const over = { ...custom, people: [{ id: "a", amount: "" }, { id: "b", amount: "1000" }, { id: "c", amount: "50" }] };
assert.match(splitProblem(over), /750.00 MVR more than the bill/);
assert.match(splitProblem({ ...custom, people: [{ id: "a", amount: "" }, { id: "b", amount: "-5" }, { id: "c", amount: "" }] }), /negative/);
assert.match(splitProblem(draft({ bill: "" })), /total bill/);
assert.match(splitProblem(draft({ people: [{ id: "a", amount: "" }] })), /at least one friend/);
assert.match(splitProblem(draft({ payer: "zz" })), /who paid/);
// the reported case: bill 50, friend typed 1000
assert.match(splitProblem(draft({ bill: "50", mode: "custom", people: [{ id: "a", amount: "" }, { id: "y", amount: "1000" }] })), /Those amounts are 950.00 MVR more than the bill/);

const b = balances([{ from: "b", to: "a", amount: 33.33 }, { from: "a", to: "c", amount: 50 }, { from: "c", to: "a", amount: 10 }, { from: "d", to: "c", amount: 5 }], "a");
assert.deepEqual(b.people, [{ id: "c", amount: -40 }, { id: "b", amount: 33.33 }]); // d→c doesn't involve a
assert.equal(b.net, -6.67);

// friends: request → notification → accept → both are friends, sender notified
let db = seed(0);
assert.equal(friendsOf(db, "raahil").length, 10);
assert.ok(!friendsOf(db, "raahil").includes("hafiz")); // still just a request
db = sendRequest(db, "raahil", "zareef");
assert.equal(sendRequest(db, "zareef", "raahil"), db); // no duplicate the other way
assert.equal(unread(db, "zareef"), 1);
db = respond(db, "zareef", "raahil", true);
assert.ok(friendsOf(db, "raahil").includes("zareef"));
assert.equal(db.notifications[0].to, "raahil");
db = respond(db, "raahil", "hafiz", false);
assert.ok(!db.friendships.some((f) => f.from === "hafiz"));

// split by Raahil, Sara paid: Ali and Raahil owe Sara; Ali and Sara are notified, Raahil isn't
const beforeAli = unread(db, "ali");
db = saveSplit(db, "raahil", draft({ payer: "sara", people: [{ id: "raahil", amount: "" }, { id: "ali", amount: "" }, { id: "sara", amount: "" }] }));
assert.equal(unread(db, "ali"), beforeAli + 1);
assert.match(db.notifications.find((n) => n.to === "ali").text, /Sara paid at Cafe. You owe them 100.00 MVR/);
const saraSees = db.notifications.filter((n) => n.to === "sara").map((n) => n.text);
assert.ok(saraSees.includes("Raahil owes you 100.00 MVR at Cafe") && saraSees.includes("Ali owes you 100.00 MVR at Cafe"));
assert.ok(!db.notifications.some((n) => n.to === "raahil" && /Cafe/.test(n.text)));
assert.deepEqual(balances(db.debts, "raahil").people.find((p) => p.id === "sara"), { id: "sara", amount: -100 });
// a split where friends owe more than the bill is never saved
assert.equal(saveSplit(db, "raahil", over), db);
// Raahil paid a later meal with Ali
db = saveSplit(db, "raahil", draft({ payer: "raahil", people: [{ id: "raahil", amount: "" }, { id: "ali", amount: "" }] }));
assert.deepEqual(balances(db.debts, "raahil").people.find((p) => p.id === "ali"), { id: "ali", amount: 150 });

db = settle(db, "raahil", "ali");
assert.equal(balances(db.debts, "raahil").people.find((p) => p.id === "ali"), undefined);
// mark read: one, then all
const two = seed(0);
assert.equal(unread(two, "raahil"), 2);
assert.equal(unread(markRead(two, "raahil", "n1"), "raahil"), 1);
assert.equal(unread(markRead(two, "raahil"), "raahil"), 0);
assert.equal(markRead(two, "ali").notifications.filter((n) => n.read).length, 0); // others untouched

// accounts: seeded hash checks out, wrong password fails, sign up rules, password change, delete
assert.equal(await signIn(seed(0), "raahil", "nope"), null);
let acc = (await signUp(db, { username: "New_1", name: " Neo ", password: "secret1" })).db;
assert.equal(await signIn(acc, "new_1", "secret1"), "new_1");
assert.ok(!acc.users.find((u) => u.id === "new_1").hash.includes("secret1")); // never stored plain
assert.match((await signUp(acc, { username: "new_1", name: "x", password: "secret1" })).error, /taken/);
assert.match((await signUp(acc, { username: "a b", name: "x", password: "secret1" })).error, /Usernames/);
assert.match((await signUp(acc, { username: "abc", name: "x", password: "123" })).error, /6 characters/);
assert.match((await changePassword(acc, "new_1", "wrong", "another1")).error, /wrong/);
acc = (await changePassword(acc, "new_1", "secret1", "another1")).db;
assert.equal(await signIn(acc, "new_1", "another1"), "new_1");
assert.match(deleteAccount(db, "raahil").error, /Settle up/); // still owes Yazak
acc = deleteAccount(acc, "new_1").db;
assert.equal(await signIn(acc, "new_1", "another1"), null);
console.log("db ok");
