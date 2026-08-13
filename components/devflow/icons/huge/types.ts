export type HugeIconEntry = {
  /** viewBox of the source artboard — always "0 0 24 24" in this set. */
  viewBox: string;
  /** Raw SVG markup (paths only), painted with currentColor. */
  body: string;
};
