import { useState } from "react";
import { Search, X } from "lucide-react";
import Picker from "../components/Picker";
import { friendsOf, money, nameOf, sharesOf, splitProblem } from "../lib/db";

const MODES = [
  ["equal", "Equally"],
  ["custom", "Custom amounts"],
];

export const Split = ({ db, me, setActivePage, draft, onReview }) => {
  const [bill, setBill] = useState(draft?.bill ?? "");
  const [place, setPlace] = useState(draft?.place ?? "");
  const [people, setPeople] = useState(draft?.people ?? [{ id: me, amount: "" }]);
  const [payer, setPayer] = useState(draft?.payer ?? me);
  const [mode, setMode] = useState(draft?.mode ?? "equal");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const current = { bill, place: place.trim(), payer, mode, people };
  const error = splitProblem(current);
  const shares = sharesOf(current);
  const hasBill = Number(bill) > 0;
  const label = (id) => (id === me ? "You" : nameOf(db, id));
  const isIn = (id) => people.some((p) => p.id === id);
  const friends = friendsOf(db, me);
  const q = query.trim().toLowerCase();
  const suggestions = friends.filter((id) => !isIn(id) && nameOf(db, id).toLowerCase().includes(q)).slice(0, 5);

  const add = (id) => {
    setPeople((ps) => [...ps, { id, amount: "" }]);
    setQuery("");
    setOpen(false);
  };
  const remove = (id) => {
    setPeople((ps) => ps.filter((p) => p.id !== id));
    if (payer === id) setPayer(me); // the payer left the split, so it falls back to you
  };
  // In custom mode the old payer keeps the share they had, so switching payer never moves numbers
  const changePayer = (id) => {
    if (mode === "custom") setPeople((ps) => ps.map((p) => (p.id === payer ? { ...p, amount: String(shares[p.id]) } : p)));
    setPayer(id);
  };
  const setAmount = (id, amount) => setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, amount } : p)));

  // What each row says happens to that person; the amount itself sits on the right
  const status = (id) => {
    if (id === payer)
      return mode === "custom" ? (id === me ? "You paid, your share is the rest" : "Paid, their share is the rest") : id === me ? "You paid the bill" : "Paid the bill";
    if (hasBill && !(shares[id] > 0)) return "Owes nothing";
    if (id === me) return `You owe ${label(payer)}`;
    return payer === me ? "Owes you" : `Owes ${label(payer)}`;
  };

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
                      onClick={() => remove(p.id)}
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
                      onClick={() => add(id)}
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

      {people.length > 1 && (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">Paid by</h3>
            <Picker
              label="Who paid the bill"
              value={payer}
              onChange={changePayer}
              options={people.map((p) => ({ value: p.id, label: label(p.id) }))}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">Split</h3>
            <div role="tablist" aria-label="How to split" className="flex rounded-lg bg-fill p-0.5 text-sm">
              {MODES.map(([m, text]) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => {
                    if (m === "custom" && mode !== "custom")
                      setPeople((ps) => ps.map((p) => ({ ...p, amount: hasBill ? String(shares[p.id]) : "" })));
                    setMode(m);
                  }}
                  className={`press rounded-md px-3 py-1.5 font-medium ${mode === m ? "bg-sheet text-ink shadow-sm" : "text-sub"}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-3">
            {people.map((p) => (
              <li key={p.id} className="flex items-center gap-3 border-t border-line py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{label(p.id)}</p>
                  <p className={`text-sm ${p.id === payer ? "text-lagoon" : "text-sub"}`}>{status(p.id)}</p>
                </div>
                {mode === "custom" && p.id !== payer ? (
                  <label className="flex items-center gap-1.5 text-sm text-sub">
                    <input
                      aria-label={`${label(p.id)}'s amount`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={p.amount}
                      onChange={(e) => setAmount(p.id, e.target.value)}
                      placeholder="0.00"
                      className="control w-24 text-right text-ink"
                    />
                    MVR
                  </label>
                ) : (
                  <span className="text-sm text-sub">{hasBill ? `${money(shares[p.id])} MVR` : "–"}</span>
                )}
              </li>
            ))}
          </ul>

          {mode === "custom" && (
            <p className="border-t border-line pt-3 text-sm text-sub">
              Enter what everyone else had. {payer === me ? "You cover" : `${label(payer)} covers`} the rest.
            </p>
          )}
        </>
      )}

      <button
        disabled={!!error}
        onClick={() => onReview(current)}
        className="press mt-6 w-full rounded-full bg-lagoon py-3 font-medium text-on-lagoon"
      >
        Review split
      </button>
      {error && <p className="mt-2 text-center text-sm text-sub">{error}</p>}
    </div>
  );
};
