import { tagKey } from "./devicon";

// Opis tagu nie jest przechowywany w bazie - powstaje z jego nazwy, dokladnie tak samo
// jak ikona w tagIcon(). Dzieki temu tagi juz zapisane w bazie nie wymagaja migracji,
// a opis pojawia sie wylacznie tam, gdzie go renderujemy (TagCard).
// Klucze sa takie same jak w DEVICON_MAP - technologia, ktora ma tu wpis, ma tez ikone.
const DESCRIPTIONS: Record<string, string> = {
  javascript:
    "The language of the browser — closures, event loops, and the parts of the spec everyone rediscovers the hard way.",
  typescript: "JavaScript with a type checker in front of it. Catches at compile time what used to page you at 3am.",
  react: "Components, state, and re-renders. The library that made the UI a function of its data.",
  nextjs: "The React framework with routing, rendering, and the server built in. Ships to the edge without a config file.",
  vuejs: "Reactive templates with a gentle learning curve. Approachable on day one, still there at scale.",
  angular: "The batteries-included framework — DI, RxJS, and a CLI that scaffolds the whole thing.",
  svelte: "A compiler pretending to be a framework. The runtime mostly disappears before it reaches the browser.",
  nodejs: "JavaScript on the server, single-threaded and event-driven. Where npm install starts to hurt.",
  python: "Readable, batteries-included, everywhere from scripts to model training. Whitespace is load-bearing.",
  java: "Verbose, predictable, and still running most of the enterprise. The JVM outlived every prediction of its death.",
  php: "Powers a large share of the web whether or not anyone admits it. Modern PHP is nothing like the memes.",
  csharp: "Microsoft's flagship language — statically typed, deeply tooled, and increasingly at home outside Windows.",
  cplusplus: "Zero-cost abstractions and every footgun ever designed. Still the answer when the microseconds matter.",
  c: "Portable assembly. Small, sharp, and underneath nearly everything else on this list.",
  go: "Simple by subtraction — goroutines, a fast compiler, and a standard library that already does it.",
  rust: "Memory safety without a garbage collector. The borrow checker argues with you now so production doesn't later.",
  ruby: "Optimised for developer happiness. Expressive to the point of reading like prose.",
  swift: "Apple's modern language — safe defaults, real generics, and no more retain/release by hand.",
  kotlin: "The pragmatic JVM language. Null safety, coroutines, and far less ceremony than Java.",
  dart: "The language behind Flutter — AOT-compiled for release, hot-reloaded while you work.",
  flutter: "One codebase, every screen. Paints its own widgets instead of borrowing the platform's.",
  html5: "The document, not the decoration. Semantic markup is the accessibility layer everything else sits on.",
  css3: "Cascade, specificity, and layout that finally works — grid and flexbox ended a decade of hacks.",
  sass: "CSS with variables, nesting, and mixins, from back when the platform had none of them.",
  tailwindcss: "Utility classes instead of stylesheets. Verbose in the markup, but the CSS stops growing.",
  bootstrap: "The grid and components that standardised responsive design. Still the fastest way to a passable layout.",
  mongodb: "Documents instead of rows. Flexible schemas until the day you need a join.",
  postgresql: "The relational database that keeps quietly winning — JSON, full-text search, and extensions for the rest.",
  mysql: "The web's default database for two decades. Fast, familiar, and everywhere.",
  redis: "In-memory data structures as a service. Cache, queue, lock, leaderboard — pick any.",
  sqlite: "A database in a single file, embedded in more devices than every server engine combined.",
  graphql: "Ask for the fields you want and get exactly those. Trades endpoint sprawl for schema design.",
  firebase: "Google's backend-in-a-box — auth, realtime data, and hosting without a server to run.",
  supabase: "Postgres with auth, storage, and realtime bolted on. Open source, and the database is just Postgres.",
  docker: "Ship the environment with the code. Ends the argument that started with \"works on my machine\".",
  kubernetes: "Container orchestration at scale — declarative, self-healing, and famously heavy for small teams.",
  git: "Distributed version control. Content-addressed, near-impossible to lose work in, and never intuitive.",
  github: "Where the code lives and the review happens. Pull requests became the industry's default workflow.",
  gitlab: "Repo, CI, registry, and issues in one place. Self-host it or don't.",
  linux: "The kernel running the servers, the phones, and the containers. Free as in freedom, and as in everywhere.",
  nginx: "Reverse proxy, load balancer, static file server. Handles the connections your app server shouldn't.",
  amazonwebservices: "The cloud that defined the category. Hundreds of services, and a bill that rewards reading the docs.",
  azure: "Microsoft's cloud — deepest integration if the rest of the stack already says Microsoft on it.",
  googlecloud: "Google's cloud, strongest where the workload is data or machine learning.",
  express: "The minimal Node web framework. Routes, middleware, and nothing you didn't ask for.",
  django: "Python's batteries-included framework — ORM, admin, and auth on day one.",
  flask: "A microframework that stays out of the way. You choose every piece around it.",
  laravel: "PHP with ergonomics — expressive syntax, a real ORM, and tooling for everything routine.",
  spring: "The Java framework that runs the enterprise. Dependency injection all the way down.",
  rails: "Convention over configuration. Opinionated enough that the whole app is predictable.",
  jest: "The test runner that made mocking and snapshots the default. Zero config to a first passing test.",
  webpack: "The bundler that taught the ecosystem to import anything. Configurable to a fault.",
  vite: "Native ES modules in dev, a real bundle in prod. Startup measured in milliseconds.",
  prisma: "A type-safe ORM where the schema generates the client. Migrations and autocomplete included.",
  jquery: "The library that papered over the browser wars. Its API outlived the problems that created it.",
  threejs: "WebGL without writing shaders by hand. Scenes, cameras, and meshes in the browser.",
};

const GENERIC =
  "A topic developers keep coming back to. Browse the questions below to see what people are actually running into.";

/**
 * A few sentences describing a tag, derived from its name — never read from the database.
 * Shares tagKey() with tagIcon(), so a technology with its own logo also has its own text;
 * everything else falls back to one generic blurb.
 */
export const tagDescription = (name: string): string => DESCRIPTIONS[tagKey(name)] ?? GENERIC;
