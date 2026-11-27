/** Static stand-in for the 3D scene: shown first, and kept for reduced motion and low-power devices. */
export function YarnPoster({ colour }: { colour: string }) {
  const wraps = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="A ball of yarn" className="h-full w-full">
      <defs>
        <radialGradient id="shade" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <clipPath id="ball"><circle cx="200" cy="200" r="150" /></clipPath>
      </defs>
      <circle cx="200" cy="200" r="150" fill={colour} />
      <g clipPath="url(#ball)" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="5">
        {wraps.map((i) => (
          <ellipse key={i} cx="200" cy="200" rx={150} ry={40 + (i % 7) * 18} transform={`rotate(${i * 26} 200 200)`} />
        ))}
      </g>
      <circle cx="200" cy="200" r="150" fill="url(#shade)" />
      <path d="M 300 300 C 340 340, 360 360, 400 372" stroke={colour} strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
  );
}
