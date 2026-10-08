import { helpArticles } from "@/lib/help/content";

export type HelpSearchItem = {
  slug: string;
  title: string;
  description: string;
  audience: "employees" | "employers";
  score: number;
};

export function searchHelpArticles(query: string, audience?: "employees" | "employers") {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const matches = helpArticles
    .filter((article) => (!audience ? true : article.audience === audience))
    .map((article) => {
      const haystack = [
        article.title,
        article.description,
        article.category,
        ...article.synonyms,
        ...article.errorCodes,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (haystack.includes(normalized)) score += 5;
      if (article.title.toLowerCase().includes(normalized)) score += 6;
      if (article.synonyms.some((value) => value.toLowerCase().includes(normalized))) score += 4;
      if (article.errorCodes.some((value) => value.toLowerCase().includes(normalized))) score += 4;
      if (article.description.toLowerCase().includes(normalized)) score += 2;

      return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        audience: article.audience,
        score,
      } satisfies HelpSearchItem;
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return matches.slice(0, 6);
}
