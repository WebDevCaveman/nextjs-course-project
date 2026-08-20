import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { IAccountDoc } from "./database/account.model";

// Poniewaz mamy juz gotowa metode api.auth.signinWithOAuth w lib/api.ts, to mozemy teraz wykorzystac callbacks - czyli funkcje zwrotne, ktore wykonaja sie w momencie, gdy uzytkownik zostanie odpowiednio zalogowany z wykorzystaniem dowolnie zdefiniowanego przez nasz dostawcy
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = (await api.accounts.getByProvider(
          account.type === "credentials" ? token.email! : account.providerAccountId
        )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      // Ten zapis oznacza, ze jesli uzytkownik probuje zalogowac sie z wykorzystaniem email/password czyli z wykorzystaniem providera typu "credentials" to od razu zwracamy true, czyli pozwalamy na zalogowanie sie. Jesli natomiast ani user ani account nie istnieja to zwracamy false, czyli blokujemy logowanie.
      if (account?.type === "credentials") return true;
      if (!user || !account) return false;

      // Dodajemy tu ! do user.name, user.email i user.image, aby upewnic sie, ze te wartosci nie sa undefined. Jesli sa undefined to TypeScript wyrzuci blad, poniewaz w SignInWithOAuthParams wszystkie te pola sa wymagane.
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: account.provider === "github" ? (profile?.login as string) : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.signinWithOAuth({
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
        user: userInfo,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
