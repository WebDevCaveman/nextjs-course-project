"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

// Wylogowanie w mobilnej nawigacji nie moze isc przez <form>, bo SheetClose zamyka panel
// juz w trakcie obslugi kliniecia - formularz znika, zanim przegladarka zdazy wyslac submit.
// Dlatego server action wolamy wprost z onClick: startuje wewnatrz kliniecia, wiec zamkniecie
// Sheeta nie ma na nie wplywu. Ikone i etykiete dostajemy jako children z komponentu
// serwerowego, dzieki czemu nie musimy dokladac wpisu do data/ui.ts.
const LogOutButton = ({ logOut, children }: { logOut: () => Promise<void>; children: React.ReactNode }) => (
  <SheetClose asChild>
    <Button variant="outline" size="rail" onClick={() => logOut()}>
      {children}
    </Button>
  </SheetClose>
);

export default LogOutButton;
