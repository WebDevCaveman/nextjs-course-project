import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { api } from "./lib/api";
import { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./lib/validations";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";

// Poniewaz mamy juz gotowa metode api.auth.signinWithOAuth w lib/api.ts, to mozemy teraz wykorzystac callbacks - czyli funkcje zwrotne, ktore wykonaja sie w momencie, gdy uzytkownik zostanie odpowiednio zalogowany z wykorzystaniem dowolnie zdefiniowanego przez nasz dostawcy
// Do providers musimy dodac obiekt Credentials (odpowiedzialny za logowanie z email/password), ktory bedzie zawieral odpowiednie pola - w naszym przypadku email i password. Dodatkowo musimy zdefiniowac funkcje authorize, ktora bedzie odpowiedzialna za autoryzacje uzytkownika - czyli sprawdzenie czy podany email i haslo sa poprawne. Jesli tak to zwracamy obiekt uzytkownika, jesli nie to zwracamy null.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(email)) as ActionResponse<IAccountDoc>;
          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;
          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(password, existingAccount.password!);
          if (isValidPassword) {
            return {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
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
