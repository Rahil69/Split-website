// Balance card styled after a rufiyaa banknote: engraved wave lines and a rosette.
const wave = (i) => {
  let d = "";
  for (let x = 0; x <= 400; x += 8) {
    const y = 28 + i * 15 + 9 * Math.sin(x / 26 + i * 0.7);
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  return d;
};
const WAVES = Array.from({ length: 14 }, (_, i) => wave(i));

const TONES = {
  owed: "bg-[#0f5f5a]",
  owe: "bg-[#9e2b3f]",
  square: "bg-[#14303a] dark:bg-[#1b363e]",
};

const Note = ({ tone, children }) => (
  <div
    className={`note-in relative overflow-hidden rounded-[1.75rem] p-5 text-white shadow-[0_12px_30px_-18px_rgb(20_48_58/0.45)] sm:p-6 ${TONES[tone]}`}
  >
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-white/10"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {WAVES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
    <svg
      viewBox="-50 -50 100 100"
      className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 text-white/15"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.5">
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse key={i} rx="44" ry="14" transform={`rotate(${i * 10})`} />
        ))}
        <circle r="14" />
      </g>
    </svg>
    <div className="relative">{children}</div>
  </div>
);

export default Note;
