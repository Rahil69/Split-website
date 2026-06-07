import { Home, Utensils } from "lucide-react";

function BottomNav(props) {
  return (
    <nav className="fixed bottom-6 left-1/2 w-50  max-w-sm -translate-x-1/2 rounded-full border border-white/50 bg-white/[0.04] p-2 shadow-[0_10px_24px_rgba(24,84,63,0.08)] backdrop-blur-2xl">
      <div className="grid grid-cols-2 gap-2 ">
        <button
          onClick={() => props.setActivePage("Home")}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold transition ${
            props.activePage === "Home"
              ? "bg-white/75 text-black shadow-sm shadow-black/5"
              : "text-black/60"
          }`}
        >
          <Home size={20} />
        </button>

        <button
          onClick={() => props.setActivePage("Split")}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition ${
            props.activePage === "Split"
              ? "bg-white/75 text-black shadow-sm shadow-black/5"
              : "text-black/60"
          }`}
        >
          <Utensils size={20} />
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;

