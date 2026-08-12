import * as React from "react";

// Vote arrows — the one icon Lucide has no match for (see ICONS.md).
// Filled rounded triangle; same call shape as a Lucide icon so call sites
// can't tell the difference: <VoteUpIcon size={16} className="..." />.
type VoteIconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function VoteIcon({ size = 24, d, ...props }: VoteIconProps & { d: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}

function VoteUpIcon(props: VoteIconProps) {
  return <VoteIcon d="M12 6.5 19.5 17.5 4.5 17.5Z" {...props} />;
}

function VoteDownIcon(props: VoteIconProps) {
  return <VoteIcon d="M12 17.5 4.5 6.5 19.5 6.5Z" {...props} />;
}

export { VoteUpIcon, VoteDownIcon };
