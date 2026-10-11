import { ArrowLeft } from "lucide-react";
import { debtsFromSplit, money, nameOf } from "../lib/db";

const ReviewSplit = ({ db, me, draft, onBack, onConfirm }) => {
  const n = (id) => nameOf(db, id);
  const sentence = ({ from, to }) =>
    from === me ? `You owe ${n(to)}` : to === me ? `${n(from)} owes you` : `${n(from)} owes ${n(to)}`;
  const debts = debtsFromSplit(draft);

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <button
        onClick={onBack}
        className="press -ml-2 flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-lagoon"
      >
        <ArrowLeft size={18} aria-hidden /> Edit split
      </button>

      <h2 className="mt-4 text-xl font-semibold tracking-tight">{draft.place || "Your bill"}</h2>
      <p className="figure mt-4 text-5xl">{money(draft.bill)}</p>
      <p className="mt-2 text-sub">
        Paid by {draft.payer === me ? "you" : n(draft.payer)},{" "}
        {draft.mode === "custom"
          ? `custom amounts for ${draft.people.length} people`
          : `split ${draft.people.length} ways at ${money(draft.bill / draft.people.length)} MVR each`}
      </p>

      <h3 className="mt-10 font-semibold">What this adds</h3>
      {debts.length === 0 ? (
        <p className="mt-1 text-sub">Only the person who paid had anything to pay, so no one owes anything.</p>
      ) : (
        <ul className="mt-2">
          {debts.map((d) => (
            <li key={d.id} className="flex items-baseline justify-between gap-4 border-t border-line py-3">
              <span className="font-medium">{sentence(d)}</span>
              <span
                className={`font-semibold ${
                  d.to === me ? "text-lagoon" : d.from === me ? "text-coral" : ""
                }`}
              >
                {money(d.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {debts.length > 0 && (
        <p className="mt-6 text-sm text-sub">Saving notifies everyone above except you.</p>
      )}

      <button
        onClick={onConfirm}
        className="press mt-8 w-full rounded-full bg-lagoon py-3 font-medium text-on-lagoon"
      >
        Save split
      </button>
    </div>
  );
};

export default ReviewSplit;
