import { Check } from "lucide-react";
import { markRead } from "../lib/db";

const when = (t) => {
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const Notifications = ({ db, setDb, me, setActivePage }) => {
  const mine = db.notifications.filter((n) => n.to === me);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
        {unread > 0 && (
          <button onClick={() => setDb(markRead(db, me))} className="press text-sm font-medium text-lagoon">
            Mark all as read
          </button>
        )}
      </div>
      {mine.length === 0 ? (
        <p className="mt-2 text-sub">
          Nothing yet. You'll hear here when a friend borrows from you or covers your share.
        </p>
      ) : (
        <ul className="mt-4">
          {mine.map((n) => (
            <li key={n.id} className="flex items-start gap-2 border-b border-line last:border-b-0">
              <button
                onClick={() => {
                  // opening a notification counts as reading it
                  setDb(markRead(db, me, n.id));
                  if (n.go) setActivePage(n.go);
                }}
                className="press flex flex-1 items-start gap-3 py-3.5 text-left"
              >
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-coral"}`}
                  aria-label={n.read ? undefined : "Unread"}
                />
                <span className="flex-1">
                  <span className={`block ${n.read ? "font-normal text-sub" : "font-medium"}`}>{n.text}</span>
                  <span className="text-sm text-sub">{when(n.date)}</span>
                </span>
              </button>
              {!n.read && (
                <button
                  onClick={() => setDb(markRead(db, me, n.id))}
                  aria-label="Mark as read"
                  title="Mark as read"
                  className="press mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sub hover:bg-fill hover:text-ink"
                >
                  <Check size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
