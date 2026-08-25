const ROUTES = {
  HOME: "/",
  COLLECTIONS: "/collections",
  JOBS: "/jobs",
  TAGS: "/tags",
  COMMUNITY: "/community",
  ASK_QUESTION: "/ask-question",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
  PROFILE: (id?: string) => (id ? `/profile/${id}` : "/profile"),
  QUESTION: (id: string) => `/questions/${id}`,
  TAG: (id: string) => `/tags/${id}`,
};

export default ROUTES;
