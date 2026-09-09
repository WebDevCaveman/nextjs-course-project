const ROUTES = {
  HOME: "/",
  COLLECTIONS: "/collections",
  // JOBS: "/jobs",
  TAGS: "/tags",
  COMMUNITY: "/community",
  ASK_QUESTION: "/ask-question",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
  BASIC_PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  QUESTION_EDIT: (id: string) => `/questions/${id}/edit`,
  ANSWER_EDIT: (id: string) => `/answers/${id}/edit`,
};

export default ROUTES;
