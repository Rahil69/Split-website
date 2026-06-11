import { Home, Utensils } from "lucide-react";

function BottomNav(props) {
  return (
    <nav className="fixed bottom-6 left-1/2 w-45 max-w-sm -translate-x-1/2 rounded-full border border-white/10 bg-white/10 p-1 shadow-[0_12px_28px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => props.setActivePage("Home")}
          className={`flex h-11 items-center justify-center rounded-full text-sm font-medium  ${
            props.activePage === "Home"
              ? "border border-neutral-400/35 text-neutral-800 bg-neutral-400/35  backdrop-blur-md transition "
              : "text-black/55"
          }`}
        >
          <Home size={20} />
        </button>

        <button
          onClick={() => props.setActivePage("Split")}
          className={`flex h-11 items-center justify-center rounded-full text-sm font-medium ${
            props.activePage === "Split"
              ? "border border-neutral-400/35 text-neutral-800 bg-neutral-400/35 backdrop-blur-md transition"
              : "text-black/55"
          }`}
        >
          <Utensils size={20} />
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
