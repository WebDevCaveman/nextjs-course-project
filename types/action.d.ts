export interface SignInWithOAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

export interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
