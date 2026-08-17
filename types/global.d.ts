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
