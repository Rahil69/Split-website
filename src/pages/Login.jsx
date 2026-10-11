import { useState } from "react";
import { signIn, signUp } from "../lib/db";

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm font-medium">{label}</span>
    <input {...props} className="control mt-1.5 w-full text-ink" />
  </label>
);

const Login = ({ db, setDb, onSignedIn }) => {
  const [mode, setMode] = useState("in");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (mode === "in") {
      const id = await signIn(db, username, password);
      if (id) onSignedIn(id);
      else setError("That username and password don't match.");
    } else {
      const res = await signUp(db, { username, name, password });
      if (res.error) setError(res.error);
      else {
        setDb(res.db);
        onSignedIn(username.trim().toLowerCase());
      }
    }
    setBusy(false);
  };

  const switchMode = () => {
    setMode(mode === "in" ? "up" : "in");
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight">Split</h1>
        <p className="mt-1 text-center text-sub">
          {mode === "in" ? "Sign in to see who owes who." : "Create an account to start splitting."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-[1.25rem] bg-sheet p-6">
          <Field
            label="Username"
            autoComplete="username"
            autoCapitalize="none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {mode === "up" && (
            <Field label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Field
            label="Password"
            type="password"
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p role="alert" className="text-sm text-coral">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="press w-full rounded-lg bg-lagoon py-2.5 text-sm font-medium text-on-lagoon"
          >
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-sub">
          {mode === "in" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="press font-medium text-lagoon">
            {mode === "in" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
