import { Home, Utensils } from "lucide-react";

function BottomNav(props) {
  const isSplitActive = props.activePage === "Split";

  return (
    <nav className="fixed bottom-6 left-1/2 w-52 max-w-sm -translate-x-1/2 rounded-full border border-white/10 !bg-white/1 p-1.5 shadow-[0_10px_24px_rgba(24,84,63,0.08)] backdrop-blur-sm transition-all duration-300 ease-out">
      <div className="relative grid h-12 grid-cols-2 gap-0">
        <span
          className={`absolute left-[17px] top-1 h-10 w-16 rounded-full bg-white/90 shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(0.45,0,0.2,1)] ${
            isSplitActive
              ? "translate-x-[98px] scale-95"
              : "translate-x-0 scale-100"
          }`}
        />
        <button
          onClick={() => props.setActivePage("Home")}
          className={`relative z-10 flex items-center justify-center rounded-full px-4 py-1 text-sm font-extrabold transition-colors duration-300 ease-out ${
            props.activePage === "Home" ? "text-black" : "text-black/60"
          }`}
        >
          <span className="flex h-10 w-16 items-center justify-center rounded-full">
            <Home size={20} />
          </span>
        </button>

        <button
          onClick={() => props.setActivePage("Split")}
          className={`relative z-10 flex items-center justify-center rounded-full px-4 py-1 text-sm font-extrabold transition-colors duration-300 ease-out ${
            props.activePage === "Split" ? "text-black" : "text-black/60"
          }`}
        >
          <span className="flex h-10 w-16 items-center justify-center rounded-full">
            <Utensils size={20} />
          </span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
