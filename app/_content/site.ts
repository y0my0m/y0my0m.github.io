import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type Entry = { number: string; date: string; title: string; excerpt: string; category: string };
export type Picture = { id: string; title: string; caption: string; context: string; place: string; date: string; image: string; tone: string };
export type ProgressGroup = { id: string; label: string; goal: string; value: number; note: string };
export type CustomPage = { slug: string; title: string; eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string; body: string };
export type SiteContent = {
  site: { name: string; navHome: string; navWriting: string; navAbout: string; navContact: string; navPictures: string; navProgress: string; navExtras: string; signal: string; footerTagline: string; footerCopyright: string; homeTitle: string; homeDescription: string };
  home: { eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string; topics: string[]; writingLabel: string; writingStart: string; writingEmphasis: string; archiveLabel: string };
  writing: { eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string };
  about: { eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string; cardTitle: string; body: string; contactLabel: string };
  contact: { eyebrow: string; email: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string };
  pictures: { eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string; items: Picture[] };
  progress: { eyebrow: string; headlineStart: string; headlineEmphasis: string; headlineEnd: string; intro: string; summaryLabel: string; groups: ProgressGroup[] };
  extras: { cursor: string; cursorColor: string; musicTracks: string[]; musicLabel: string; musicVolume: number; buildCrewAgents: number; buildCrewSpeed: number };
  entries: Entry[];
  pages: CustomPage[];
};

export const contentPath = path.join(process.cwd(), "app", "_content", "site.json");
const audioPath = path.join(process.cwd(), "public", "audio");

// Older copies of site.json may predate the pictures/progress sections. Defaulting
// here keeps every page rendering instead of throwing on a missing field.
const emptyPictures = { eyebrow: "", headlineStart: "", headlineEmphasis: "", headlineEnd: "", intro: "", items: [] };
const emptyProgress = { eyebrow: "", headlineStart: "", headlineEmphasis: "", headlineEnd: "", intro: "", summaryLabel: "Overall", groups: [] };
const emptyExtras = { cursor: "none", cursorColor: "#7654ff", musicTracks: [] as string[], musicLabel: "Background music", musicVolume: 35, buildCrewAgents: 6, buildCrewSpeed: 0.65 };

export async function getSiteContent(): Promise<SiteContent> {
  const parsed = JSON.parse(await readFile(contentPath, "utf8")) as Partial<SiteContent>;
  let audioTracks: string[] = [];
  try {
    audioTracks = (await readdir(audioPath, { withFileTypes: true }))
      .filter((file) => file.isFile() && /\.(mp3|m4a|wav|ogg|aac)$/i.test(file.name))
      .map((file) => `/audio/${encodeURIComponent(file.name)}`)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch { /* optional folder */ }
  return {
    ...parsed,
    // Defaults go last so they only fill gaps, never overwrite real content.
    site: { ...(parsed.site ?? ({} as SiteContent["site"])), navHome: parsed.site?.navHome ?? "Home", navPictures: parsed.site?.navPictures ?? "Pictures", navProgress: parsed.site?.navProgress ?? "Progress", navExtras: parsed.site?.navExtras ?? "Extras" },
    home: parsed.home ?? ({} as SiteContent["home"]),
    writing: parsed.writing ?? ({} as SiteContent["writing"]),
    about: parsed.about ?? ({} as SiteContent["about"]),
    contact: parsed.contact ?? ({} as SiteContent["contact"]),
    entries: parsed.entries ?? [],
    pictures: { ...emptyPictures, ...(parsed.pictures ?? {}) },
    progress: { ...emptyProgress, ...(parsed.progress ?? {}) },
    extras: { ...emptyExtras, ...(parsed.extras ?? {}), musicTracks: audioTracks },
    pages: parsed.pages ?? [],
  };
}
