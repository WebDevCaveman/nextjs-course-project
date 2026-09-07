import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kolko z logo Next w lewym dolnym rogu nachodzilo na tresc kart podczas pracy.
  // Tylko `next dev` - w buildzie produkcyjnym nigdy sie nie renderowalo.
  // Bledy kompilacji i runtime'u Next pokazuje dalej.
  devIndicators: false,
};

export default nextConfig;
