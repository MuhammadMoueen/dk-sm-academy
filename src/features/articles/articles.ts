import type { Article } from "@/types/article";

export const articles: Article[] = [];

export function getPublishedArticles() {
  return articles
    .filter((article) => article.status === "published")
    .slice()
    .sort((first, second) => {
      if (
        first.displayOrder !== undefined &&
        second.displayOrder !== undefined &&
        first.displayOrder !== second.displayOrder
      ) {
        return first.displayOrder - second.displayOrder;
      }

      if (first.displayOrder !== undefined) return -1;
      if (second.displayOrder !== undefined) return 1;

      return (
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime()
      );
    });
}

export function getPublishedArticleBySlug(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug);
}
