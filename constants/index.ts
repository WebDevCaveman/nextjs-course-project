import { uiIcons } from "@/components/icons/huge/data/ui";
import ROUTES from "./routes";

export const links = [
  { href: ROUTES.HOME, label: "Home", icon: uiIcons.home },
  { href: ROUTES.COMMUNITY, label: "Community", icon: uiIcons.users },
  { href: ROUTES.COLLECTIONS, label: "Collections", icon: uiIcons.star },
  { href: ROUTES.JOBS, label: "Find Jobs", icon: uiIcons.briefcase },
  { href: ROUTES.TAGS, label: "Tags", icon: uiIcons.tag },
  { href: ROUTES.PROFILE(), label: "Profile", icon: uiIcons.users },
  { href: ROUTES.ASK_QUESTION, label: "Ask a Question", icon: uiIcons.plus },
];

export const homeFilters = [
  { name: "Newest", value: "newest" },
  { name: "Recommended", value: "recommended" },
  { name: "Frequent", value: "frequent" },
  { name: "Unanswered", value: "unanswered" },
];

export const tagsFilters = [
  { name: "Popular", value: "popular" },
  { name: "Recent", value: "recent" },
  { name: "Oldest", value: "oldest" },
  { name: "Name ASC", value: "name_asc" },
  { name: "Name DESC", value: "name_desc" },
];

export const answersFilters = [
  { name: "Latest", value: "latest" },
  { name: "Oldest", value: "oldest" },
  { name: "Popular", value: "popular" },
];

export const usersFilters = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Popular", value: "popular" },
];

// Bloki wstawione w edytorze jako "Plain text" nie maja jezyka w markdownie, wiec
// rehype-highlight domyslnie ich nie koloruje. Detekcja ograniczona do jezykow, ktore
// oferuje edytor - bez tego zawezenia highlight.js zgaduje np. ini albo scss i myli sie.
export const CODE_LANGUAGES = ["javascript", "typescript", "xml", "css", "json", "python", "sql", "bash"];
