import type { Metadata } from "next";
import ReactDOM from "react-dom";
import "./globals.css";
import ThemeProvider from "@/context/Theme";

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
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

  // Bez suppressHydrationWarning bedziemy otrzymywac warningi w konsoli przegladarki, poniewaz Next.js renderuje strone po stronie serwera, a nastepnie po stronie klienta. W tym przypadku, gdy uzytkownik zmieni tryb z jasnego na ciemny lub odwrotnie, Next.js nie bedzie w stanie zsynchronizowac stanu motywu miedzy serwerem a klientem, co moze prowadzic do roznych wynikow renderowania. Aby temu zapobiec, dodajemy suppressHydrationWarning do tagu html.
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
