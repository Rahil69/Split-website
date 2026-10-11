import { useState } from "react";
import { Search } from "lucide-react";
import { friendship, friendsOf, nameOf, respond, sendRequest } from "../lib/db";

const Avatar = ({ name }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fill text-sm font-semibold text-sub">
    {name[0]}
  </span>
);

const Row = ({ name, note, children }) => (
  <li className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line py-3.5 last:border-b-0">
    <Avatar name={name} />
    <div className="min-w-32 flex-1">
      <p className="truncate font-medium">{name}</p>
      {note && <p className="text-sm text-sub">{note}</p>}
    </div>
    {children && <div className="ml-auto flex gap-2">{children}</div>}
  </li>
);

const Friends = ({ db, setDb, me }) => {
  const friends = friendsOf(db, me);
  const incoming = db.friendships.filter((f) => f.to === me && f.status === "pending").map((f) => f.from);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? db.users.filter(
        (u) => u.id !== me && !friends.includes(u.id) && !incoming.includes(u.id) && u.name.toLowerCase().includes(q),
      )
    : [];

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight">Friends</h2>
      <p className="mt-1 text-sub">You can split bills with anyone on your friends list.</p>

      <label className="control mt-6">
        <Search size={15} className="shrink-0 text-sub" aria-hidden />
        <span className="sr-only">Find people by name</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find people by name"
          className="placeholder:text-sub"
        />
      </label>
      {q && results.length === 0 && (
        <p className="mt-3 text-sm text-sub">No one new called "{query.trim()}".</p>
      )}
      {results.length > 0 && (
        <ul className="mt-2">
          {results.map((u) => {
            const sent = friendship(db, me, u.id);
            return (
              <Row key={u.id} name={u.name} note={sent ? "Request sent" : null}>
                <button
                  disabled={!!sent}
                  onClick={() => setDb(sendRequest(db, me, u.id))}
                  className="press rounded-full bg-lagoon px-3.5 py-1.5 text-sm font-medium text-on-lagoon"
                >
                  {sent ? "Requested" : "Add friend"}
                </button>
              </Row>
            );
          })}
        </ul>
      )}

      {incoming.length > 0 && (
        <>
          <h3 className="mt-8 font-semibold">Requests</h3>
          <ul className="mt-1">
            {incoming.map((id) => (
              <Row key={id} name={nameOf(db, id)} note="Wants to be friends">
                <button
                  onClick={() => setDb(respond(db, me, id, false))}
                  className="press rounded-full border border-line px-3.5 py-1.5 text-sm font-medium"
                >
                  Decline
                </button>
                <button
                  onClick={() => setDb(respond(db, me, id, true))}
                  className="press rounded-full bg-lagoon px-3.5 py-1.5 text-sm font-medium text-on-lagoon"
                >
                  Accept
                </button>
              </Row>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-8 font-semibold">Your friends</h3>
      {friends.length === 0 ? (
        <p className="mt-1 text-sub">No friends yet. Search for someone above.</p>
      ) : (
        <ul className="mt-1">
          {friends.map((id) => (
            <Row key={id} name={nameOf(db, id)} />
          ))}
        </ul>
      )}

    </div>
  );
};

export default Friends;
