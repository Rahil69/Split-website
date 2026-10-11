import { useState } from "react";
import Note from "../components/Note";
import { balances, money, nameOf, remind, settle } from "../lib/db";

const day = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const Home = ({ db, setDb, me, setActivePage }) => {
  const { people, owed, owe, net } = balances(db.debts, me);
  const [status, setStatus] = useState(null);
  const tone = net > 0 ? "owed" : net < 0 ? "owe" : "square";
  const splits = db.splits.filter((s) => s.people.includes(me)).slice(0, 5);

  const settleUp = (id) => {
    setStatus({ text: `Settled up with ${nameOf(db, id)}`, prev: db });
    setDb(settle(db, me, id));
  };

  const nudge = (id, amount) => {
    setStatus({ text: `Reminder sent to ${nameOf(db, id)}` });
    setDb(remind(db, me, id, amount));
  };

  return (
    <div>
      <Note tone={tone}>
        <p className="font-medium text-white/80">
          {tone === "owed" ? "You're owed" : tone === "owe" ? "You owe" : "All square"}
        </p>
        <p className="figure mt-2 text-5xl sm:text-6xl">{money(Math.abs(net))}</p>
        <p className="mt-1 font-medium text-white/70">Rufiyaa</p>

        {(owed > 0 || owe > 0) && (
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm">
            <div>
              <dt className="text-white/70">Coming to you</dt>
              <dd className="mt-0.5 font-medium">{money(owed)}</dd>
            </div>
            <div>
              <dt className="text-white/70">You need to pay</dt>
              <dd className="mt-0.5 font-medium">{money(owe)}</dd>
            </div>
          </dl>
        )}
      </Note>

      {status && (
        <div
          role="status"
          className="mt-4 flex items-center justify-between rounded-2xl bg-fill px-4 py-3 text-sm text-ink"
        >
          <span>{status.text}</span>
          {status.prev && (
            <button
              className="press font-medium text-lagoon"
              onClick={() => {
                setDb(status.prev);
                setStatus(null);
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}

      <h2 className="mt-10 text-xl font-semibold tracking-tight">People</h2>

      {people.length === 0 ? (
        <div className="mt-3">
          <p className="max-w-[34ch] text-sub">
            Nobody owes anybody. When someone covers a friend's share, it shows up here.
          </p>
          <button
            onClick={() => setActivePage("Split")}
            className="press mt-4 rounded-full bg-lagoon px-5 py-2.5 font-medium text-on-lagoon"
          >
            Split a bill
          </button>
        </div>
      ) : (
        <ul className="mt-2">
          {people.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line py-4 last:border-b-0">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  p.amount > 0 ? "bg-lagoon/15 text-lagoon" : "bg-coral/15 text-coral"
                }`}
              >
                {nameOf(db, p.id)[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{nameOf(db, p.id)}</p>
                <p className="text-sm text-sub">{p.amount > 0 ? "Owes you" : "You owe them"}</p>
              </div>
              <p className={`font-semibold ${p.amount > 0 ? "text-lagoon" : "text-coral"}`}>
                {money(Math.abs(p.amount))}
              </p>
              <div className="flex w-full justify-end gap-2 sm:w-auto">
                {p.amount > 0 && (
                  <button
                    onClick={() => nudge(p.id, p.amount)}
                    className="press rounded-full bg-fill px-3 py-1 text-sm font-medium"
                  >
                    Remind
                  </button>
                )}
                <button
                  onClick={() => settleUp(p.id)}
                  className="press rounded-full border border-line px-3 py-1 text-sm font-medium hover:bg-fill"
                >
                  Settle up
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {splits.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold tracking-tight">Recent splits</h2>
          <ul className="mt-2">
            {splits.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.place || "Bill"}</p>
                  <p className="text-sm text-sub">
                    {day(s.date)}, {s.people.length} people, added by{" "}
                    {s.by === me ? "you" : nameOf(db, s.by)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{money(s.shares?.[me] ?? 0)}</p>
                  <p className="text-sm text-sub">your share</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
