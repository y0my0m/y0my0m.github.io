import type { Entry } from "../_content/site";
import Link from "next/link";

export default function NotesDatabase({ entries }: { entries: Entry[] }) {
  return (
    <section className="notes-database wrap" aria-labelledby="notes-title">
      <div className="section-head" data-reveal>
        <div>
          <p className="eyebrow"><span /> Writing database</p>
          <h2 id="notes-title">Every note, <em className="shiny-text">in one place.</em></h2>
        </div>
        <p className="notes-count">{String(entries.length).padStart(2, "0")} notes indexed</p>
      </div>
      <div className="notes-grid">
        {entries.map((entry, index) => (
          <Link className="note-card" data-build="scale" data-spotlight key={`${entry.number}-${entry.title}`} href={`/writing#note-${encodeURIComponent(entry.number)}`} aria-label={`Open note ${entry.title} in Writing`}>
            <div className="note-card-meta"><span>{entry.number}</span><span>{entry.date}</span></div>
            <div>
              <p className="note-category">{entry.category}</p>
              <h3>{entry.title}</h3>
              <p>{entry.excerpt}</p>
            </div>
            {index < 3 ? <span className="note-view-more">View more <b>↗</b></span> : null}
            <span className="note-index">{String(index + 1).padStart(2, "0")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
