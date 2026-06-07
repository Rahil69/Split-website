import { Home, Utensils } from "lucide-react";

function BottomNav(props) {
  return (
    <nav className="fixed bottom-6 left-1/2 w-50  max-w-sm -translate-x-1/2 rounded-full border border-white/80 bg-white/10 p-2 shadow-[0_10px_24px_rgba(24,84,63,0.10)] backdrop-blur-xl">
      <div className="grid grid-cols-2 gap-2 ">
        <button
          onClick={() => props.setActivePage("Home")}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold transition ${
            props.activePage === "Home"
              ? "bg-emerald-900 text-white "
              : "text-emerald-700/70"
          }`}
        >
          <Home size={20} />
        </button>

        <button
          onClick={() => props.setActivePage("Split")}
          className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition ${
            props.activePage === "Split"
              ? "bg-emerald-900 text-white shadow-2xs shadow-emerald-200"
              : "text-emerald-700/70"
          }`}
        >
          <Utensils size={20} />
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;

