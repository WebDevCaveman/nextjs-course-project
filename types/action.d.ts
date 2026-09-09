import { INTERACTIONS, ScoredInteraction } from "@/constants/interactions";

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

export interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

export interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

export interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

export interface GetQuestionParams {
  questionId: string;
}

export interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

export interface IncrementViewsParams {
  questionId: string;
  userId?: string;
}

export interface CreateAnswerParams {
  questionId: string;
  content: string;
}

export interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

export interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

export type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

export interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

export interface GetAnswerVotesParams {
  answerIds: string[];
}

// Mapa id odpowiedzi -> typ glosu, ktory oddal na nia zalogowany uzytkownik.
// Odpowiedzi bez glosu po prostu nie maja tu klucza.
export type AnswerVotesResponse = Record<string, "upvote" | "downvote">;

export interface CollectionBaseParams {
  questionId: string;
}

export interface GetUserDetailsParams {
  userId: string;
}

export interface GetUserQuestionsAndAnswersParams extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

export interface DeleteQuestionParams {
  questionId: string;
}

export interface DeleteAnswerParams {
  answerId: string;
}

export interface CreateInteractionParams {
  action: (typeof INTERACTIONS)[number];
  actionTarget: "question" | "answer";
  actionId: string;
  authorId?: string; // User who owns the content
  query?: string; // Search phrase
}

export interface UpdateUserReputationParams {
  userId: string;
  authorId?: string; // User who owns the content
  interaction: ScoredInteraction;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}
