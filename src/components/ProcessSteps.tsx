/** Illustrated "how a piece is made" steps, drawn as small pixel icons. Copy is draft, for client approval. */
const C: Record<string, string> = {
  k: "#241a3a", y: "#7a2f3f", Y: "#a8495f", l: "#b9a4f2", L: "#9480d8", t: "#f6c94c", p: "#f490b4", n: "#22325c", w: "#ffffff", g: "#c9ccd4",
};

const STEPS: { title: string; text: string; icon: string[] }[] = [
  {
    title: "Pick the yarn",
    text: "Every piece starts with choosing colours, often with you, until the palette feels right.",
    icon: ["..kkkk..", ".kyYyyk.", "kyyyYyyk", "kyYyyyyk", "kyyyyYyk", "kyyYyyyk", ".kyyyyk.", "..kkkk.y"],
  },
  {
    title: "Make a chain",
    text: "A slip knot, then a row of chain stitches. This sets the width of the whole piece.",
    icon: ["........", ".kk.kk..", "kllkllk.", "k.lk.lkg", "kllkllkg", ".kk.kk.g", "......g.", "........"],
  },
  {
    title: "Build the rows",
    text: "Row by row, stitch by stitch, the shape grows. A bag can take a few thousand stitches.",
    icon: ["kkkkkkkk", "kttttttk", "kppppppk", "kttttttk", "kppppppk", "kttttttk", "kppppppk", "kkkkkkkk"],
  },
  {
    title: "Add the beads",
    text: "Beads are threaded on one at a time where a piece needs a bit of shine.",
    icon: ["........", "......kk", ".....kt.", "..kkpk..", ".kln.k..", "kyk.....", "k.......", "........"],
  },
  {
    title: "Finish and pack",
    text: "Ends are woven in, the piece is checked over, then wrapped up and sent to you.",
    icon: ["...kk...", "..kppk..", "kkkkkkkk", "klllpllk", "klllpllk", "klllpllk", "klllpllk", "kkkkkkkk"],
  },
];

function Icon({ grid }: { grid: string[] }) {
  return (
    <svg viewBox="0 0 8 8" className="h-14 w-14" shapeRendering="crispEdges" aria-hidden="true">
      {grid.flatMap((row, r) => [...row].map((ch, c) => (C[ch] ? <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={C[ch]} /> : null)))}
    </svg>
  );
}

export function ProcessSteps() {
  return (
    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((s) => (
        <li key={s.title} className="rounded-lg border-4 border-ink bg-surface p-5 shadow-[6px_6px_0_var(--ink)]">
          <Icon grid={s.icon} />
          <h3 className="mt-4 text-2xl">{s.title}</h3>
          <p className="mt-2 text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
