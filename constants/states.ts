import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  image: {
    light: "/states/empty-light.svg",
    dark: "/states/empty-dark.svg",
    alt: "Empty state",
  },
  title: "No Data Found",
  message: "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  image: {
    light: "/states/error-light.svg",
    dark: "/states/error-dark.svg",
    alt: "Error state",
  },
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_DENIED = {
  image: {
    light: "/states/denied-light.svg",
    dark: "/states/denied-dark.svg",
    alt: "Denied state",
  },
  title: "Join to unlock this feature",
  message: "Create a free account or sign in to access all features and become part of the community.",
  button: {
    text: "Join Now",
    href: ROUTES.SIGN_UP,
  },
};

export const EMPTY_QUESTIONS = {
  image: {
    light: "/states/empty-questions-light.svg",
    dark: "/states/empty-questions-dark.svg",
    alt: "Empty questions state",
  },
  title: "Ahh, No Questions Yet!",
  message: "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
  button: {
    text: "Ask a Question",
    href: ROUTES.ASK_QUESTION,
  },
};

export const EMPTY_TAGS = {
  image: {
    light: "/states/empty-tags-light.svg",
    dark: "/states/empty-tags-dark.svg",
    alt: "Empty tags state",
  },
  title: "No Tags Found",
  message: "The tag cloud is empty. Add some keywords to make it rain.",
  button: {
    text: "Create Tag",
    href: ROUTES.TAGS,
  },
};

export const EMPTY_ANSWERS = {
  image: {
    light: "/states/empty-answers-light.svg",
    dark: "/states/empty-answers-dark.svg",
    alt: "Empty answers state",
  },
  title: "No Answers Found",
  message: "The answer board is empty. Make it rain with your brilliant answer.",
};

export const EMPTY_COLLECTIONS = {
  image: {
    light: "/states/empty-collections-light.svg",
    dark: "/states/empty-collections-dark.svg",
    alt: "Empty collections state",
  },
  title: "Collections Are Empty",
  message: "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
  button: {
    text: "Save to Collection",
    href: ROUTES.COLLECTIONS,
  },
};

export const EMPTY_USERS = {
  image: {
    light: "/states/empty-users-light.svg",
    dark: "/states/empty-users-dark.svg",
    alt: "Empty users state",
  },
  title: "No Users Found",
  message: "You're ALONE. The only one here. More uses are coming soon!",
};
