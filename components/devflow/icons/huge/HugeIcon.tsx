import type { SVGProps } from "react";

import type { HugeIconName } from "./names";
import { CATEGORY_LOADERS } from "./registry";

export interface HugeIconProps extends Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML" | "children"> {
  /** "<category>/<icon>", e.g. "interface/search-01". Autocompletes. */
  name: HugeIconName;
  /** Square size in px. 14 meta / 16 button / 20 search / 21 nav, like every other icon here. */
  size?: number;
}

/**
 * Huge Icons (outline) as a React Server Component.
 * The icon's category chunk is loaded on the server, so nothing is shipped to the client.
 * Colour comes from currentColor — set it with a text-* token class, never a hex.
 */
export async function HugeIcon({ name, size = 24, ...props }: HugeIconProps) {
  const slash = name.indexOf("/");
  const category = name.slice(0, slash);
  const icon = name.slice(slash + 1);

  const load = CATEGORY_LOADERS[category];
  if (!load) throw new Error(`[HugeIcon] unknown category "${category}" (from "${name}")`);

  const { icons } = await load();
  const entry = icons[icon];
  if (!entry) throw new Error(`[HugeIcon] unknown icon "${name}"`);

  return (
    <svg
      width={size}
      height={size}
      viewBox={entry.viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: entry.body }}
    />
  );
}

export default HugeIcon;
