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

// Seamless version for tiling: the wave length divides the 400px tile width, phases cycle
// every 14 lines (one 210px tile), and the lines either side of the tile cover the wrap.
const tileWave = (i) => {
  let d = "";
  for (let x = 0; x <= 400; x += 8) {
    const y = 7.5 + i * 15 + 9 * Math.sin((2 * Math.PI * x) / 200 + (i * 2 * Math.PI) / 14);
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  return d;
};
const TILE_WAVES = Array.from({ length: 16 }, (_, i) => tileWave(i - 1));

// Engraved wave lines on their own. Stretched to fit a card, or tiled at natural size
// (tile) so tall surfaces don't get bloated waves. Tiled waves can sit on a fill colour and be
// cut to a shape (clip = id of a <clipPath> passed as children), drawn inside this same SVG.
export const Waves = ({ className = "", tile = false, fill, clip, children }) => {
  const lines = (
    <g fill="none" stroke="currentColor" strokeWidth="0.8">
      {(tile ? TILE_WAVES : WAVES).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
  return (
    <svg
      viewBox={tile ? undefined : "0 0 400 240"}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      {tile ? (
        <>
          <defs>
            <pattern id={`waves-tile-${clip ?? "plain"}`} width="400" height="210" patternUnits="userSpaceOnUse">
              {lines}
            </pattern>
            {children}
          </defs>
          <g clipPath={clip ? `url(#${clip})` : undefined}>
            {fill && <rect width="100%" height="100%" fill={fill} />}
            <rect width="100%" height="100%" fill={`url(#waves-tile-${clip ?? "plain"})`} />
          </g>
        </>
      ) : (
        lines
      )}
    </svg>
  );
};

// Banknote rosette: rotated ellipses around a ring
export const Rosette = ({ className = "" }) => (
  <svg viewBox="-50 -50 100 100" className={`pointer-events-none absolute ${className}`} aria-hidden>
    <g fill="none" stroke="currentColor" strokeWidth="0.5">
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse key={i} rx="44" ry="14" transform={`rotate(${i * 10})`} />
      ))}
      <circle r="14" />
    </g>
  </svg>
);

const TONES = {
  owed: "bg-[#0f5f5a]",
  owe: "bg-[#9e2b3f]",
  square: "bg-[#14303a] dark:bg-[#1b363e]",
};

const Note = ({ tone, children }) => (
  <div
    className={`note-in relative overflow-hidden rounded-[1.75rem] p-5 text-white shadow-[0_12px_30px_-18px_rgb(20_48_58/0.45)] sm:p-6 ${TONES[tone]}`}
  >
    <Waves className="text-white/10" />
    <Rosette className="-right-10 -top-10 h-48 w-48 text-white/15" />
    <div className="relative">{children}</div>
  </div>
);

export default Note;
