// Run: node src/lib/db.test.js
import assert from "node:assert/strict";
import {
  balances,
  debtsFromSplit,
  friendsOf,
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

// debts: blank amount = whole share, odd cents rounded
const people = [
  { id: "a", borrowedFrom: null, amount: "" },
  { id: "b", borrowedFrom: "a", amount: "33.333" },
  { id: "c", borrowedFrom: null, amount: "" },
  { id: "d", borrowedFrom: "c", amount: "" },
];
const debts = debtsFromSplit({ people, place: "Cafe", share: 20 }, 1);
assert.deepEqual(debts.map((d) => [d.from, d.to, d.amount]), [["b", "a", 33.33], ["d", "c", 20]]);

const b = balances([...debts, { from: "a", to: "c", amount: 50 }, { from: "c", to: "a", amount: 10 }], "a");
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

// split by Raahil: Ali borrows from Raahil, Raahil borrows from Sara
const before = unread(db, "ali");
db = saveSplit(db, "raahil", {
  bill: "300",
  place: "Cafe",
  share: 100,
  people: [
    { id: "raahil", borrowedFrom: "sara", amount: "40" },
    { id: "ali", borrowedFrom: "raahil", amount: "" },
    { id: "sara", borrowedFrom: null, amount: "" },
  ],
});
assert.equal(unread(db, "ali"), before + 1); // borrower told
assert.match(db.notifications.find((n) => n.to === "sara").text, /Raahil borrowed 40.00 MVR from you at Cafe/);
assert.ok(!db.notifications.some((n) => n.to === "raahil" && /Cafe/.test(n.text))); // creator not told
assert.deepEqual(balances(db.debts, "raahil").people.find((p) => p.id === "ali"), { id: "ali", amount: 100 });

db = settle(db, "raahil", "ali");
assert.equal(balances(db.debts, "raahil").people.find((p) => p.id === "ali"), undefined);
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
