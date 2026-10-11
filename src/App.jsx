import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import { Split } from "./pages/Split";
import ReviewSplit from "./pages/ReviewSplit";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import { load, loadMe, markRead, save, saveMe, saveSplit, unread } from "./lib/db";

const PAGES = ["Balances", "Split", "Friends", "Notifications"];
const fromHash = () => PAGES.find((p) => `#${p.toLowerCase()}` === location.hash) ?? "Split";

function App() {
  const [db, setDbState] = useState(load);
  const [me, setMeState] = useState(loadMe);
  const [activePage, setPage] = useState(fromHash);
  const [fresh, setFresh] = useState([]); // notifications that were unread when the page opened
  const [draft, setDraft] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  const setDb = (next) => {
    setDbState(next);
    save(next);
  };

  // Each page gets its own #address so back/forward and refresh work
  const setActivePage = (name) => {
    if (name !== activePage) history.pushState(null, "", `#${name.toLowerCase()}`);
    if (name === "Notifications") {
      setFresh(db.notifications.filter((n) => n.to === me && !n.read).map((n) => n.id));
      setDb(markRead(db, me));
    }
    setPage(name);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const sync = () => setPage(fromHash());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const switchUser = (id) => {
    setMeState(id);
    saveMe(id);
    setDraft(null);
    setReviewing(false);
  };

  const confirmSplit = () => {
    setDb(saveSplit(db, me, draft));
    setDraft(null);
    setReviewing(false);
    setActivePage("Balances");
  };

  const count = unread(db, me);
  const props = { db, setDb, me, setActivePage };

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-5 lg:h-18 lg:max-w-3xl">
          <h1 className="mr-auto text-xl font-semibold tracking-tight">Split</h1>
          <Nav activePage={activePage} setActivePage={setActivePage} className="hidden bg-fill lg:flex" />

          <button
            onClick={() => setActivePage("Notifications")}
            aria-label={count ? `Notifications, ${count} unread` : "Notifications"}
            aria-current={activePage === "Notifications" ? "page" : undefined}
            className={`press relative flex h-10 w-10 items-center justify-center rounded-full ${
              activePage === "Notifications" ? "bg-ink text-paper" : "bg-fill"
            }`}
          >
            <Bell size={18} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-medium text-white">
                {count}
              </span>
            )}
          </button>

          {/* Demo-only: act as any placeholder user to see what they see */}
          <label className="flex items-center gap-2 text-sm text-sub">
            <span className="hidden sm:inline">Viewing as</span>
            <select
              value={me}
              onChange={(e) => switchUser(e.target.value)}
              aria-label="Viewing as"
              className="press rounded-full bg-fill py-2 pl-3 pr-2 font-medium text-ink outline-none"
            >
              {db.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-32 pt-4 lg:max-w-2xl lg:pb-16 lg:pt-8">
        {activePage === "Balances" && <Home {...props} />}
        {activePage === "Friends" && <Friends {...props} />}
        {activePage === "Notifications" && <Notifications {...props} fresh={fresh} />}
        {/* Split stays mounted so a half-filled split survives a tab switch */}
        <div hidden={activePage !== "Split"}>
          {reviewing ? (
            <ReviewSplit
              db={db}
              me={me}
              draft={draft}
              onBack={() => setReviewing(false)}
              onConfirm={confirmSplit}
            />
          ) : (
            <Split
              key={me}
              {...props}
              draft={draft}
              onReview={(d) => {
                setDraft(d);
                setReviewing(true);
              }}
            />
          )}
        </div>
      </main>

      <Nav
        activePage={activePage}
        setActivePage={setActivePage}
        className="glass fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 shadow-[0_12px_32px_rgb(0_0_0/0.14)] lg:hidden"
      />
    </div>
  );
}

export default App;
