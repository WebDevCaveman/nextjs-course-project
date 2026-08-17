import type { HugeIconEntry } from "./types";

/**
 * One dynamic import per category, so a page only ships the categories it uses.
 * Keys match the prefix in an icon name ("interface/search-01" -> "interface").
 */
export const CATEGORY_LOADERS: Record<string, () => Promise<{ icons: Record<string, HugeIconEntry> }>> = {
  arrows: () => import("./data/arrows"),
  business: () => import("./data/business"),
  communication: () => import("./data/communication"),
  device: () => import("./data/device"),
  ecommerce: () => import("./data/ecommerce"),
  editor: () => import("./data/editor"),
  education: () => import("./data/education"),
  files: () => import("./data/files"),
  finance: () => import("./data/finance"),
  grid: () => import("./data/grid"),
  health: () => import("./data/health"),
  "interface": () => import("./data/interface"),
  menu: () => import("./data/menu"),
  multimedia: () => import("./data/multimedia"),
  navigation: () => import("./data/navigation"),
  notes: () => import("./data/notes"),
  shipping: () => import("./data/shipping"),
  smarthouse: () => import("./data/smarthouse"),
  social: () => import("./data/social"),
  time: () => import("./data/time"),
  user: () => import("./data/user"),
  weather: () => import("./data/weather"),
};
