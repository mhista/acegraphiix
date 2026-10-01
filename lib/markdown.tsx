/* A deliberately small Markdown renderer for project and blog bodies:
   headings (## / ###), paragraphs, bullet lists, > quotes, images, links,
   **bold** and *italic*. Everything is escaped by React — no raw HTML. */

import { Fragment, type ReactNode } from "react";

function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(!?\[([^\]]*)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = key;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const safe = /^(https?:|mailto:|\/)/.test(m[3]) ? m[3] : "#";
      if (m[1].startsWith("!")) {
        // eslint-disable-next-line @next/next/no-img-element
        out.push(<img key={k++} src={safe} alt={m[2]} loading="lazy" />);
      } else {
        out.push(
          <a key={k++} href={safe} target={safe.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {m[2]}
          </a>,
        );
      }
    } else if (m[4]) out.push(<strong key={k++}>{m[5]}</strong>);
    else if (m[6]) out.push(<em key={k++}>{m[7]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string | null | undefined }) {
  if (!source) return null;
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-site">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        if (t.startsWith("### ")) return <h3 key={i}>{inline(t.slice(4))}</h3>;
        if (t.startsWith("## ")) return <h2 key={i}>{inline(t.slice(3))}</h2>;
        if (t.startsWith("# ")) return <h2 key={i}>{inline(t.slice(2))}</h2>;
        if (t.startsWith("> ")) return <blockquote key={i}>{inline(t.replace(/^>\s?/gm, ""))}</blockquote>;
        const lines = t.split("\n");
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
