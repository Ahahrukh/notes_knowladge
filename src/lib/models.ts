// Flexible content model — add new topics/sections/blocks without schema migrations.

export type ContentBlock =
  | { type: "text"; value: string }            // markdown-lite paragraph (Hinglish)
  | { type: "heading"; value: string; level?: 2 | 3 | 4 }
  | { type: "code"; language: string; value: string; explanation?: string }
  | { type: "note"; value: string }            // callout / tip box
  | { type: "list"; items: string[]; ordered?: boolean };

export interface Topic {
  slug: string;
  title: string;
  description: string;
  icon?: string;        // emoji
  color?: string;       // tailwind hex
  order: number;
  createdAt?: Date;
}

export interface Section {
  topicSlug: string;
  slug: string;
  title: string;
  summary?: string;
  order: number;
  content: ContentBlock[];
}

export interface InterviewQuestion {
  topicSlug: string;
  question: string;
  answer: string;       // Hinglish explanation, may include code in ```
  difficulty: "easy" | "medium" | "hard";
  order: number;
}

export const COLLECTIONS = {
  topics: "topics",
  sections: "sections",
  interview: "interview_questions",
} as const;
