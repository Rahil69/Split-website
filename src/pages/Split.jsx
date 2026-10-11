import { useState } from "react";
import { Search, X } from "lucide-react";
import Picker from "../components/Picker";
import { cents, friendsOf, money, nameOf } from "../lib/db";

const person = (id) => ({ id, borrowedFrom: null, amount: "" });

// Who paid the whole bill: the one person everyone else is covered by, "" if all paid
// their own, "mixed" if the rows say something else.
const payerOf = (people) => {
  const from = new Set(people.map((p) => p.borrowedFrom));
  if (from.size === 1 && from.has(null)) return "";
  const x = people.find((p) => p.borrowedFrom === null && from.has(p.id))?.id;
  return x && people.every((p) => p.id === x || p.borrowedFrom === x) ? x : "mixed";
};

const problem = (bill, people) => {
  if (!(Number(bill) > 0)) return "Enter the total bill to continue.";
  if (people.length < 2) return "Pick at least one friend who was there.";
  if (people.some((p) => p.borrowedFrom !== null && p.amount !== "" && !(Number(p.amount) > 0)))
    return "Borrowed amounts must be more than 0.";
  return null;
};

export const Split = ({ db, me, setActivePage, draft, onReview }) => {
  const [bill, setBill] = useState(draft?.bill ?? "");
  const [place, setPlace] = useState(draft?.place ?? "");
  const [people, setPeople] = useState(draft?.people ?? [person(me)]);
  const friends = friendsOf(db, me);
  const share = Number(bill) > 0 ? cents(Number(bill) / people.length) : 0;
  const error = problem(bill, people);
  const label = (id) => (id === me ? "You" : nameOf(db, id));
  const isIn = (id) => people.some((p) => p.id === id);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const suggestions = friends
    .filter((id) => !isIn(id) && nameOf(db, id).toLowerCase().includes(q))
    .slice(0, 5);

  const toggle = (id) =>
    setPeople((ps) =>
      isIn(id)
        ? ps
            .filter((p) => p.id !== id)
            .map((p) => (p.borrowedFrom === id ? { ...p, borrowedFrom: null } : p))
        : // someone joining a bill one person paid owes them too
          [...ps, { ...person(id), borrowedFrom: payerOf(ps) && payerOf(ps) !== "mixed" ? payerOf(ps) : null }],
    );

  const setPayer = (x) =>
    setPeople((ps) => ps.map((p) => ({ ...p, borrowedFrom: x && p.id !== x ? x : null, amount: "" })));
  const payer = payerOf(people);

  const update = (id, field, value) =>
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight">New split</h2>

      <label htmlFor="bill" className="mt-6 block text-sm font-medium text-sub">
        Total bill
      </label>
      <div className="mt-1 flex items-baseline gap-2">
        <input
          id="bill"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="0.00"
          style={{ width: `${(bill.length || 4) * 0.6 + 0.1}em` }}
          className="figure max-w-full bg-transparent text-5xl outline-none placeholder:text-line"
        />
        <span className="font-medium text-sub">MVR</span>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-sub">Where did you eat?</span>
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Seagull Cafe"
          className="line-input mt-1 w-full py-1.5 font-medium placeholder:font-normal placeholder:text-sub/60"
        />
      </label>

      <h3 className="mt-10 font-semibold">Who was there</h3>
      {friends.length === 0 ? (
        <p className="mt-1 text-sub">
          You can only split with friends.{" "}
          <button onClick={() => setActivePage("Friends")} className="press font-medium text-lagoon underline">
            Add a friend
          </button>
        </p>
      ) : (
        <>
          {people.length > 1 && (
            <ul aria-label="Friends at this meal" className="mt-3 flex flex-wrap gap-1.5">
              {people
                .filter((p) => p.id !== me)
                .map((p) => (
                  <li key={p.id} className="badge">
                    {label(p.id)}
                    <button
                      onClick={() => toggle(p.id)}
                      aria-label={`Remove ${label(p.id)}`}
                      className="press rounded-sm p-0.5 text-sub hover:bg-fill hover:text-ink"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
            </ul>
          )}
          <div className="relative mt-3">
            <label className="control">
              <Search size={15} className="shrink-0 text-sub" aria-hidden />
              <span className="sr-only">Add a friend to this split</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                placeholder="Add a friend"
                className="placeholder:text-sub"
              />
            </label>
            {open && (suggestions.length > 0 || q) && (
              <ul className="menu absolute inset-x-0 top-full z-10 mt-1">
                {suggestions.map((id) => (
                  <li key={id}>
                    <button
                      // mousedown fires before the input's blur closes the list
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        toggle(id);
                        setQuery("");
                        setOpen(false);
                      }}
                      className="menu-item"
                    >
                      {nameOf(db, id)}
                    </button>
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <li className="px-2 py-1.5 text-sm text-sub">No friends match "{query.trim()}".</li>
                )}
              </ul>
            )}
          </div>
        </>
      )}
      <p className="mt-4 text-sm text-sub">
        {people.length} {people.length === 1 ? "person" : "people"}
        {share > 0 && `, ${money(share)} MVR each`}
      </p>

      {people.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-fill/60 px-3 py-2.5">
          <span className="text-sm font-medium">Who paid the bill?</span>
          <Picker
            label="Who paid the bill"
            value={payer}
            onChange={(v) => v !== "mixed" && setPayer(v)}
            options={[
              { value: "", label: "Each paid their own" },
              ...people.map((p) => ({ value: p.id, label: label(p.id) })),
              ...(payer === "mixed" ? [{ value: "mixed", label: "Mixed" }] : []),
            ]}
          />
        </div>
      )}

      <ul className="mt-4">
        {people.map((p) => (
          <li key={p.id} className="border-t border-line py-3">
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate font-medium">{label(p.id)}</p>
              {people.length > 1 && (
                <Picker
                  label={`Who covered ${label(p.id)}`}
                  value={p.borrowedFrom ?? ""}
                  onChange={(v) => update(p.id, "borrowedFrom", v || null)}
                  options={[
                    { value: "", label: "Paid own share" },
                    ...people.filter((o) => o.id !== p.id).map((o) => ({ value: o.id, label: `${label(o.id)} covered` })),
                  ]}
                />
              )}
              <span className="w-16 text-right text-sm text-sub">{money(share)}</span>
            </div>

            {p.borrowedFrom !== null && (
              <label className="mt-2 flex items-center justify-end gap-2 text-sm text-sub">
                Amount covered
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={p.amount}
                  onChange={(e) => update(p.id, "amount", e.target.value)}
                  placeholder={money(share)}
                  className="control w-24 text-right text-ink"
                />
                MVR
              </label>
            )}
          </li>
        ))}
      </ul>

      <button
        disabled={!!error}
        onClick={() => onReview({ bill, place: place.trim(), people, share })}
        className="press mt-6 w-full rounded-full bg-lagoon py-3 font-medium text-on-lagoon"
      >
        Review split
      </button>
      {error && <p className="mt-2 text-center text-sm text-sub">{error}</p>}
    </div>
  );
};
