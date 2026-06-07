import { useState } from "react";
import { Bell, User } from "lucide-react";
import { Split } from "./pages/Split";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Split");

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-neutral-100 text-emerald-950">
      <main className="h-screen overflow-y-auto pb-28 pt-6">
        <header className="flex items-center justify-between px-6">
          <h1 className="flex text-xl font-extrabold tracking-tight text-emerald-950">
            <p>
              <User
                size={30}
                className="cursor-pointer rounded-full border border-white/80 bg-white/70 text-emerald-900 shadow-sm backdrop-blur-xl"
              />
            </p>
            <p className="pl-3">Split.</p>
          </h1>

          <button className="cursor-pointer rounded-full border border-white/80 bg-white/70 p-2 text-emerald-900 shadow-sm backdrop-blur-xl">
            <Bell size={20} />
          </button>
        </header>

        <div className="mt-5">
          {activePage === "Home" && <Home />}
          {activePage === "Split" && <Split />}
        </div>
      </main>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default App;
