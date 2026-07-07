import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },

    { url: `${BASE}/about`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/employers`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/employees`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/security`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blogs`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/careers`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/partners`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/culture`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/docs`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sales`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    { url: `${BASE}/faq`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/status`,   lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/schedule`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    { url: `${BASE}/wiza-ai-for-eaziwage`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculator`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    { url: `${BASE}/partners/onboarding`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
