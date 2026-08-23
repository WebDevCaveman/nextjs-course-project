const ROUTES = {
  HOME: "/",
  COLLECTIONS: "/collections",
  JOBS: "/find-jobs",
  TAGS: "/tags",
  COMMUNITY: "/community",
  ASK_QUESTION: "/ask-question",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  PROFILE: (id?: string) => (id ? `/profile/${id}` : "/profile"),
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
  QUESTION: (id: string) => `/questions/${id}`,
};

export default ROUTES;
