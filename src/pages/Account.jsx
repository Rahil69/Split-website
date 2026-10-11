import { useState } from "react";
import { LogOut } from "lucide-react";
import { balances, changePassword, deleteAccount, friendsOf, rename, seed } from "../lib/db";

const Section = ({ title, note, children }) => (
  <section className="border-t border-line py-6 first:border-t-0 first:pt-0">
    <h3 className="font-semibold">{title}</h3>
    {note && <p className="mt-0.5 text-sm text-sub">{note}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm font-medium">{label}</span>
    <input {...props} className="control mt-1.5 w-full text-ink" />
  </label>
);

const Message = ({ msg }) =>
  msg && (
    <p role="status" className={`text-sm ${msg.ok ? "text-lagoon" : "text-coral"}`}>
      {msg.text}
    </p>
  );

const button = "press rounded-lg px-3.5 py-2 text-sm font-medium";

const Account = ({ db, setDb, me, onSignOut }) => {
  const user = db.users.find((u) => u.id === me);
  const [name, setName] = useState(user.name);
  const [nameMsg, setNameMsg] = useState(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const open = balances(db.debts, me).people.length;

  const saveName = (e) => {
    e.preventDefault();
    if (!name.trim()) return setNameMsg({ text: "Enter your name." });
    setDb(rename(db, me, name));
    setNameMsg({ ok: true, text: "Name saved." });
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return setPwMsg({ text: "New passwords don't match." });
    const res = await changePassword(db, me, pw.current, pw.next);
    if (res.error) return setPwMsg({ text: res.error });
    setDb(res.db);
    setPw({ current: "", next: "", confirm: "" });
    setPwMsg({ ok: true, text: "Password changed." });
  };

  const remove = () => {
    const res = deleteAccount(db, me);
    if (res.error) return setDeleteMsg({ text: res.error });
    setDb(res.db);
    onSignOut();
  };

  return (
    <div className="rounded-[1.25rem] bg-sheet p-5 sm:p-7">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lagoon/15 text-lg font-semibold text-lagoon">
          {user.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold tracking-tight">{user.name}</h2>
          <p className="text-sm text-sub">
            @{user.id}, joined {new Date(user.created).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-sub">
        {friendsOf(db, me).length} friends, {db.splits.filter((s) => s.people.includes(me)).length} splits
      </p>

      <div className="mt-8">
        <Section title="Profile" note="This is the name friends see on splits and notifications.">
          <form onSubmit={saveName} className="space-y-3">
            <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Field label="Username" value={user.id} disabled readOnly />
            <Message msg={nameMsg} />
            <button className={`${button} bg-ink text-paper`}>Save name</button>
          </form>
        </Section>

        <Section title="Password">
          <form onSubmit={savePassword} className="space-y-3">
            <Field
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              required
            />
            <Field
              label="New password"
              type="password"
              autoComplete="new-password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              required
            />
            <Field
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              required
            />
            <Message msg={pwMsg} />
            <button className={`${button} bg-ink text-paper`}>Change password</button>
          </form>
        </Section>

        <Section title="Session">
          <button onClick={onSignOut} className={`${button} flex items-center gap-2 border border-line`}>
            <LogOut size={15} aria-hidden /> Sign out
          </button>
        </Section>

        <Section
          title="Delete account"
          note={
            open
              ? `You still have open balances with ${open} ${open === 1 ? "person" : "people"}. Settle up first.`
              : "This removes your account, friends and notifications. Splits you were in stay for the others."
          }
        >
          {!deleting ? (
            <button
              disabled={!!open}
              onClick={() => setDeleting(true)}
              className={`${button} border border-coral/40 text-coral`}
            >
              Delete account
            </button>
          ) : (
            <div className="space-y-3">
              <Field
                label={`Type ${user.id} to confirm`}
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                autoCapitalize="none"
              />
              <Message msg={deleteMsg} />
              <div className="flex gap-2">
                <button onClick={() => setDeleting(false)} className={`${button} border border-line`}>
                  Cancel
                </button>
                <button
                  disabled={confirmDelete !== user.id}
                  onClick={remove}
                  className={`${button} bg-coral text-white`}
                >
                  Delete for good
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Demo data" note="Puts every placeholder account, friend and split back to the start.">
          <button
            onClick={() => {
              setDb(seed());
              onSignOut();
            }}
            className={`${button} border border-line`}
          >
            Reset demo data
          </button>
        </Section>
      </div>
    </div>
  );
};

export default Account;
