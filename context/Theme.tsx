// Aby uzyskac mozliwosc przelacznia trybow dark/ligh musimy najpierw zainstalowac paczke next-themes i kolejno utworzyc Provider, ktory potem wykorzystamy w glownym layout.tsx

"use client";

import { ThemeProviderProps, ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
