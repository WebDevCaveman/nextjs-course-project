export const INTERACTIONS = [
  "question_post",
  "question_delete",
  "answer_post",
  "answer_delete",
  "upvote_add",
  "upvote_remove",
  "downvote_add",
  "downvote_remove",
  "bookmark_add",
  "bookmark_remove",
  "view",
  "edit",
  "search", // pomijam, ale dodalem "query" na interaction wiec mozna wdrozyc pozniej
] as const;

export const INTERACTIONS_POINTS = {
  [INTERACTIONS[0]]: { user: 5, author: 0 },
  [INTERACTIONS[1]]: { user: -5, author: 0 },
  [INTERACTIONS[2]]: { user: 10, author: 10 },
  [INTERACTIONS[3]]: { user: -10, author: -10 },
  [INTERACTIONS[4]]: { user: 2, author: 10 },
  [INTERACTIONS[5]]: { user: -2, author: -10 },
  [INTERACTIONS[6]]: { user: -1, author: -2 },
  [INTERACTIONS[7]]: { user: 1, author: 2 },
  [INTERACTIONS[8]]: { user: 1, author: 2 },
  [INTERACTIONS[9]]: { user: -1, author: -2 },
};

export type ScoredInteraction = keyof typeof INTERACTIONS_POINTS;

export const isScoredInteraction = (action: (typeof INTERACTIONS)[number]): action is ScoredInteraction =>
  action in INTERACTIONS_POINTS;
