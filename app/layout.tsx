import type { Metadata } from "next";
import ReactDOM from "react-dom";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevFlow",
  description: "Next.js 16 awesomeness with Turborepo, TailwindCSS, and TypeScript",
  manifest: "/brand/site.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Switzer only — it renders all UI text, so it sits on the critical path.
  // Inter is the non-Latin fallback and devicon is per-page; preloading either
  // would cost bytes most visits never use.
  ReactDOM.preload("/fonts/Switzer-Variable.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
