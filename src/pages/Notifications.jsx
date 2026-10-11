const when = (t) => {
  const mins = Math.round((Date.now() - t) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const Notifications = ({ db, me, setActivePage, fresh }) => {
  const mine = db.notifications.filter((n) => n.to === me);

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
      {mine.length === 0 ? (
        <p className="mt-2 text-sub">
          Nothing yet. You'll hear here when a friend borrows from you or covers your share.
        </p>
      ) : (
        <ul className="mt-4">
          {mine.map((n) => (
            <li key={n.id} className="border-b border-line last:border-b-0">
              <button
                onClick={() => n.go && setActivePage(n.go)}
                className="press flex w-full items-start gap-3 py-3.5 text-left"
              >
                <span
                  className={`mt-2 h-2 w-2 shrink-0 rounded-full ${fresh.includes(n.id) ? "bg-coral" : "bg-transparent"}`}
                  aria-label={fresh.includes(n.id) ? "New" : undefined}
                />
                <span className="flex-1">
                  <span className={`block ${fresh.includes(n.id) ? "font-medium" : "font-normal text-sub"}`}>{n.text}</span>
                  <span className="text-sm text-sub">{when(n.date)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
