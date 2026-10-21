import type { ContentStatus } from "@/types/common";

export type ArticleContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "link"; text: string; href: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  hashtags: string[];
  content: ArticleContentBlock[];
  thumbnailUrl: string;
  category?: string;
  displayOrder?: number;
  status: ContentStatus;
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}
