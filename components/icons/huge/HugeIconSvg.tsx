import type { SVGProps } from "react";

import type { HugeIconEntry } from "./types";

export interface HugeIconSvgProps extends Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML" | "children"> {
  icon: HugeIconEntry;
  size?: number;
}

/**
 * Synchronous escape hatch for Client Components: import the category module you need
 * and pass the entry in, so only that chunk ends up in the client bundle.
 *
 *   "use client";
 *   import { icons } from "@/components/icons/huge/data/interface";
 *   import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
 *   <HugeIconSvg icon={icons["search-01"]} size={20} />
 */
export function HugeIconSvg({ icon, size = 24, ...props }: HugeIconSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

export default HugeIconSvg;
