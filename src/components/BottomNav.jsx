import { Home, Utensils } from "lucide-react";

function BottomNav(props) {
  return (
    <nav className="fixed bottom-6 left-1/2 w-52 max-w-sm -translate-x-1/2 rounded-full border border-white/10 !bg-white/1 p-1.5 shadow-[0_10px_24px_rgba(24,84,63,0.08)] backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-0 ">
        <button
          onClick={() => props.setActivePage("Home")}
          className={`flex items-center justify-center rounded-full px-4 py-1 text-sm font-extrabold transition ${
            props.activePage === "Home" ? "text-black" : "text-black/60"
          }`}
        >
          <span
            className={`flex h-10 w-16 items-center justify-center rounded-full transition ${
              props.activePage === "Home"
                ? "bg-white/90 shadow-md  ring-black/5"
                : ""
            }`}
          >
            <Home size={20} />
          </span>
        </button>

        <button
          onClick={() => props.setActivePage("Split")}
          className={`flex items-center justify-center rounded-full px-4 py-1 text-sm font-extrabold transition ${
            props.activePage === "Split" ? "text-black" : "text-black/60"
          }`}
        >
          <span
            className={`flex h-10 w-16 items-center justify-center rounded-full transition ${
              props.activePage === "Split"
                ? "bg-white/90 shadow-md  ring-black/5"
                : ""
            }`}
          >
            <Utensils size={20} />
          </span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
