// Typy powiazane z baza danych
interface Tag {
  _id: string;
  name: string;
  questions?: string | number;
  description?: string;
}

interface Author {
  _id: string;
  name: string;
  image?: string;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: string;
  upvotes: number;
  downvotes: number;
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

type PaginatedSearchParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
};
