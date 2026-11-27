/** A visible marker for copy or media the client still has to supply. Logged in PRD section 8. */
export function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="placeholder">[{children}]</span>;
}
