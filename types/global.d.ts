// Typy powiazane z baza danych
interface Tag {
  _id: string;
  name: string;
  /** Omit to drop the count entirely. */
  count?: string | number;
}

interface Author {
  _id: string;
  name: string;
  image?: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  votes: number;
  answers: number;
  views: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

// Typy powiazane z API
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

// Typ powiazany z parametrami, ktore wykorzystujemy w komponentach dla stron dynamicznych
type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};
