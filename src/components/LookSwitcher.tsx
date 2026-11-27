"use client";

import { useEffect, useState } from "react";

const looks = [
  { id: "candy", name: "Candy pop" },
  { id: "studio", name: "Soft studio" },
  { id: "night", name: "Night bead" },
] as const;

/** Review-only control for comparing the three concepts. Remove once the client picks one. */
export function LookSwitcher() {
  const [look, setLook] = useState("candy");

  useEffect(() => {
    setLook(document.documentElement.dataset.look ?? "candy");
  }, []);

  function choose(id: string) {
    setLook(id);
    document.documentElement.dataset.look = id;
    try { localStorage.setItem("ly-look", id); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("look", id);
    window.history.replaceState(null, "", url);
  }

  return (
    <fieldset className="fixed bottom-20 left-4 z-50 flex gap-1 rounded-full border border-line bg-surface p-1 text-sm shadow md:bottom-4">
      <legend className="sr-only">Visual concept</legend>
      {looks.map((l) => (
        <label key={l.id} className={`cursor-pointer rounded-full px-3 py-1.5 ${look === l.id ? "bg-accent text-accent-ink" : "text-ink"}`}>
          <input type="radio" name="look" value={l.id} checked={look === l.id} onChange={() => choose(l.id)} className="sr-only" />
          {l.name}
        </label>
      ))}
    </fieldset>
  );
}

/** Runs before paint so the chosen concept shows without a flash. */
export const lookInitScript = `(function(){try{var q=new URLSearchParams(location.search).get('look');var s=q||localStorage.getItem('ly-look');if(s==='candy'||s==='studio'||s==='night'){document.documentElement.dataset.look=s;}}catch(e){}})();`;
