import { uiIcons } from "@/components/icons/huge/data/ui";
import ROUTES from "./routes";

export const links = [
  { href: ROUTES.HOME, label: "Home", icon: uiIcons.home },
  { href: ROUTES.COMMUNITY, label: "Communities", icon: uiIcons.users },
  { href: ROUTES.COLLECTIONS, label: "Collections", icon: uiIcons.star },
  { href: ROUTES.JOBS, label: "Find Jobs", icon: uiIcons.briefcase },
  { href: ROUTES.TAGS, label: "Tags", icon: uiIcons.tag },
  { href: ROUTES.PROFILE(), label: "Profile", icon: uiIcons.users },
  { href: ROUTES.ASK_QUESTION, label: "Ask a Question", icon: uiIcons.plus },
];

export const filters = [
  { name: "Newest", value: "newest" },
  { name: "Recommended", value: "recommended" },
  { name: "Frequent", value: "frequent" },
  { name: "Unanswered", value: "unanswered" },
];
