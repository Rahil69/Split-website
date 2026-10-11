import { useLayoutEffect, useRef, useState } from "react";
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

// Shapes for the wavy edge, all with the same commands so any one can morph into another.
// REST and DRIFT are the slow loop; FLAT is the edge tucked away at the right, which the
// page-load flow-in grows out of, so it arrives like water instead of sliding in.
const REST = "M1,0 L0.3,0 C0.12,0.1 0.24,0.24 0.14,0.36 C0.03,0.5 0.22,0.6 0.12,0.74 C0.04,0.86 0.16,0.94 0.2,1 L1,1 Z";
const DRIFT = "M1,0 L0.24,0 C0.06,0.13 0.3,0.22 0.19,0.38 C0.09,0.53 0.15,0.62 0.07,0.77 C0.01,0.89 0.22,0.94 0.15,1 L1,1 Z";
const FLAT = "M1,0 L1,0 C0.97,0.1 1,0.24 0.99,0.36 C0.97,0.5 1,0.6 0.98,0.74 C0.97,0.86 1,0.94 1,1 L1,1 Z";
const EASE = "0.45 0 0.55 1";
const still = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const Login = ({ db, setDb, onSignedIn }) => {
  const [mode, setMode] = useState("in");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const flowIn = useRef(null);
  // SVG animation clocks start with the page, not with this component, so start the flow-in
  // ourselves the moment it is on screen (before paint, so the tucked edge never flashes)
  useLayoutEffect(() => flowIn.current?.beginElement?.(), []);


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
    <div className="relative min-h-screen overflow-hidden">
      {/* Brand shape: lagoon with the banknote engraving and a slowly moving wavy edge, desktop only */}
      <aside className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Waves tile fill="#0f5f5a" clip="blob" className="text-white/[0.12]">
          <clipPath id="blob" clipPathUnits="objectBoundingBox">
            <path d={still ? REST : FLAT}>
              {/* flows in on load, then slowly reshapes like water; none of it when motion is reduced */}
              {!still && (
                <>
                  <animate
                    ref={flowIn}
                    id="flow-in"
                    attributeName="d"
                    begin="indefinite"
                    dur="1.6s"
                    fill="freeze"
                    values={`${FLAT};${REST}`}
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.3 0.5 0.2 1"
                  />
                  <animate
                    attributeName="d"
                    dur="14s"
                    begin="flow-in.end"
                    repeatCount="indefinite"
                    values={`${REST};${DRIFT};${REST}`}
                    calcMode="spline"
                    keySplines={`${EASE};${EASE}`}
                  />
                </>
              )}
            </path>
          </clipPath>
        </Waves>
      </aside>

      <p className="absolute left-5 top-6 text-lg font-semibold tracking-tight sm:left-10 lg:left-14 lg:top-10">Split</p>

      <main className="relative flex min-h-screen items-center justify-center px-5 py-24 lg:w-1/2">
        <div className="w-full max-w-[25rem]">
          <h1 className="rise text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            {mode === "in" ? "Welcome back!" : "Join Split"}
          </h1>
          <p className="rise mt-3 text-sub" style={{ animationDelay: "80ms" }}>
            {mode === "in" ? "See who owes who from your last meal out." : "Split your next bill in under a minute."}
          </p>

          <div
            style={{ animationDelay: "160ms" }}
            className="rise mt-8 rounded-2xl border border-line bg-sheet p-6 shadow-[0_1px_2px_rgb(20_48_58/0.06),0_12px_32px_-16px_rgb(20_48_58/0.2)] sm:p-7"
          >
            <h2 className="font-semibold">{mode === "in" ? "Sign in to Split" : "Create your account"}</h2>

            <form onSubmit={submit} className="mt-5 space-y-4">
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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm">
              <p className="text-sub">
                {mode === "in" ? "No account yet?" : "Already have one?"}{" "}
                <button
                  onClick={() => switchTo(mode === "in" ? "up" : "in")}
                  className="press font-medium text-lagoon"
                >
                  {mode === "in" ? "Create one" : "Sign in"}
                </button>
              </p>
              {mode === "in" && (
                <button
                  onClick={() => {
                    setUsername("raahil");
                    setPassword("password");
                    setError(null);
                  }}
                  className="press rounded-md border border-line px-2.5 py-1 font-medium hover:bg-fill"
                >
                  Use demo
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;
