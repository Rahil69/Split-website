import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

// Styled replacement for <select>: native menus ignore the app's theme.
const Picker = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const outside = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const escape = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="control press max-w-44 bg-sheet text-ink"
      >
        <span className="truncate">{current.label}</span>
        <ChevronsUpDown size={14} className="shrink-0 text-sub" aria-hidden />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="menu absolute right-0 top-full z-20 mt-1 min-w-full">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="menu-item flex items-center justify-between gap-4 whitespace-nowrap"
              >
                {o.label}
                <Check size={14} className={o.value === value ? "text-lagoon" : "invisible"} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Picker;
