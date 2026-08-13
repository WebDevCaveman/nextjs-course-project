import { Home, Star, Briefcase, Tag, Users, Plus } from "lucide-react";
import ROUTES from "./routes";

export const links = [
  { href: ROUTES.HOME, label: "Home", Icon: Home },
  { href: ROUTES.COMMUNITY, label: "Communities", Icon: Users },
  { href: ROUTES.COLLECTIONS, label: "Collections", Icon: Star },
  { href: ROUTES.JOBS, label: "Find Jobs", Icon: Briefcase },
  { href: ROUTES.TAGS, label: "Tags", Icon: Tag },
  { href: ROUTES.PROFILE, label: "Profile", Icon: Users },
  { href: ROUTES.ASK_QUESTION, label: "Ask a Question", Icon: Plus },
];
