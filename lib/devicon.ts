import { DEVICON_MAP } from "./devicon-map.ts";

// Shorthands people type that devicon's own altnames do not cover.
const ALIASES: Record<string, string> = {
  next: "nextjs",
  node: "nodejs",
  vue: "vuejs",
  postgres: "postgresql",
  tailwind: "tailwindcss",
  k8s: "kubernetes",
  mongo: "mongodb",
  html: "html5",
  css: "css3",
};

const normalise = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\+\+/g, "plusplus")
    .replace(/#/g, "sharp")
    .replace(/^\./, "dot")
    .replace(/[^a-z0-9]/g, "");

/**
 * The DEVICON_MAP key a tag name resolves to, aliases applied. "React", "react.js"
 * and "REACT " all give the same key — as do "next" and "nextjs". Shared with
 * tagDescription() so a tag's logo and its blurb always agree on identity.
 */
export const tagKey = (name: string): string => {
  const key = normalise(name);
  return ALIASES[key] ?? key;
};

/**
 * The devicon class for a tag name, or null when the set has no logo for it —
 * callers fall back to a generic tag icon. "React", "react.js" and "REACT " all
 * resolve to the same class.
 */
export const tagIcon = (name: string): string | null => {
  const found = DEVICON_MAP[tagKey(name)];
  return found ? `devicon-${found}` : null;
};
