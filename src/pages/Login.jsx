import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Waves } from "../components/Note";
import { signIn, signUp } from "../lib/db";

const Field = ({ label, children, ...props }) => (
  <label className="block">
    <span className="text-sm font-medium">{label}</span>
    <span className="control mt-1.5 h-10">
      <input {...props} className="text-ink" />
      {children}
    </span>
  </label>
);

const Login = ({ db, setDb, onSignedIn }) => {
  const [mode, setMode] = useState("in");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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

  const switchTo = (m) => {
    setMode(m);
    setError(null);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[2fr_3fr]">
      {/* Quiet brand panel: deep lagoon with the banknote engraving as texture, desktop only */}
      <aside className="relative hidden overflow-hidden bg-[#0f5f5a] p-12 text-white lg:block">
        <Waves tile className="text-white/[0.06]" />
        <p className="relative text-lg font-semibold tracking-tight">Split</p>
      </aside>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-20">
        <p className="absolute left-4 top-6 text-lg font-semibold tracking-tight lg:hidden">Split</p>
        {/* shadcn-style: the other mode is a quiet link in the corner, not a toggle */}
        <button
          onClick={() => switchTo(mode === "in" ? "up" : "in")}
          className="press absolute right-4 top-5 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-fill lg:right-8 lg:top-8"
        >
          {mode === "in" ? "Create account" : "Sign in"}
        </button>

        <div className="w-full max-w-[22rem]">
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            {mode === "in" ? "Sign in to Split" : "Create an account"}
          </h1>
          <p className="mt-1.5 text-center text-sm text-sub">
            {mode === "in" ? "Enter your username and password." : "Pick a username and password to get started."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
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
              type={show ? "text" : "password"}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            >
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                className="press shrink-0 text-sub hover:text-ink"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>
            {error && (
              <p role="alert" className="text-sm text-coral">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="press h-10 w-full rounded-lg bg-lagoon text-sm font-medium text-on-lagoon"
            >
              {mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          {mode === "in" && (
            <p className="mt-6 text-center text-sm text-sub">
              Just looking?{" "}
              <button
                onClick={() => {
                  setUsername("raahil");
                  setPassword("password");
                  setError(null);
                }}
                className="press font-medium text-ink underline underline-offset-4 hover:text-lagoon"
              >
                Use the demo account
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
