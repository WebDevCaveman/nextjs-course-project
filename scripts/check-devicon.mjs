// Self-check for lib/devicon.ts. No framework, no runner config:
//   node --experimental-strip-types scripts/check-devicon.mjs
// Exits non-zero on the first mismatch, so it works as a pre-commit gate too.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { tagIcon } = await import(pathToFileURL(path.join(root, "lib/devicon.ts")).href);

const cases = [
  // same tag, however it is typed
  ["react", "devicon-react-plain colored"],
  ["React", "devicon-react-plain colored"],
  ["  REACT  ", "devicon-react-plain colored"],
  ["react.js", "devicon-react-plain colored"],
  ["reactjs", "devicon-react-plain colored"],
  // symbols that would otherwise collide on "c"
  ["C++", "devicon-cplusplus-plain colored"],
  ["C#", "devicon-csharp-plain colored"],
  ["c", "devicon-c-plain colored"],
  [".NET", "devicon-dot-net-plain colored"],
  // devicon's own altnames
  ["js", "devicon-javascript-plain colored"],
  ["Node.js", "devicon-nodejs-plain colored"],
  ["Tailwind CSS", "devicon-tailwindcss-plain colored"],
  // our ALIASES
  ["next", "devicon-nextjs-plain"],
  ["node", "devicon-nodejs-plain colored"],
  ["postgres", "devicon-postgresql-plain colored"],
  ["k8s", "devicon-kubernetes-plain colored"],
  // black marks keep `colored` off so they survive dark mode
  ["Next.js", "devicon-nextjs-plain"],
  ["apple", "devicon-apple-plain"],
  ["github", "devicon-github-plain"],
  // no logo — caller falls back to a generic tag icon
  ["a tag nobody has a logo for", null],
  ["", null],
  ["   ", null],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = tagIcon(input);
  if (got !== expected) {
    console.error(`FAIL  tagIcon(${JSON.stringify(input)}) = ${got}, expected ${expected}`);
    failed++;
  }
}

if (failed) {
  console.error(`${failed}/${cases.length} failed`);
  process.exit(1);
}
console.log(`devicon: ${cases.length}/${cases.length} ok`);
