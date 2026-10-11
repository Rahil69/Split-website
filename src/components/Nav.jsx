import { CircleUser, Scale, Users, Utensils } from "lucide-react";

const tabs = [
  { name: "Balances", Icon: Scale },
  { name: "Split", Icon: Utensils },
  { name: "Friends", Icon: Users },
  { name: "Account", Icon: CircleUser },
];

// Same tabs in two places: header bar on desktop, floating bar on phones.
function Nav({ activePage, setActivePage, compact = false, className = "" }) {
  return (
    <nav aria-label="Pages" className={`gap-1 rounded-full p-1 ${className}`}>
      {tabs.map(({ name, Icon }) => (
        <a
          key={name}
          href={`#${name.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            setActivePage(name);
          }}
          aria-current={activePage === name ? "page" : undefined}
          className={`press flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium ${
            activePage === name ? "bg-ink text-paper" : "text-sub hover:text-ink"
          }`}
        >
          <Icon size={18} aria-hidden />
          {/* phones: only the current tab shows its label, so four tabs fit */}
          <span className={compact && activePage !== name ? "sr-only" : ""}>{name}</span>
        </a>
      ))}
    </nav>
  );
}

export default Nav;
