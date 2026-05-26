/**
 * SEO Utilities for the AI-Powered Coding Platform
 * Handles metadata, Open Graph tags, and schema markup
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
  robots?: string;
  twitterHandle?: string;
}

export const DEFAULT_SEO_CONFIG: SEOConfig = {
  title: "CodeNova AI - Master Coding with AI-Powered Learning",
  description:
    "Learn to code smarter with AI assistance. Solve problems, practice coding, participate in contests, and prepare for interviews with CodeNova AI - the ultimate platform for aspiring developers.",
  keywords: [
    "coding practice",
    "online compiler",
    "coding contests",
    "interview preparation",
    "learn programming",
    "AI coding assistant",
    "competitive programming",
    "code snippets",
    "programming tutorials",
    "tech jobs",
  ],
  image: "https://ai-powered-coding-platform.vercel.app/og-image.jpg",
  url: "https://ai-powered-coding-platform.vercel.app",
  type: "website",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  twitterHandle: "@CodeNovaAI",
};

/**
 * Generate meta tags for a page
 */
export const generateMetaTags = (config: SEOConfig) => {
  const seo = { ...DEFAULT_SEO_CONFIG, ...config };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    image: seo.image,
    url: seo.url,
    robots: seo.robots,
  };
};

/**
 * Generate Open Graph tags
 */
export const generateOpenGraphTags = (config: SEOConfig) => {
  const seo = { ...DEFAULT_SEO_CONFIG, ...config };

  return {
    "og:title": seo.title,
    "og:description": seo.description,
    "og:image": seo.image,
    "og:url": seo.url,
    "og:type": seo.type || "website",
    "og:site_name": "CodeNova AI",
    "og:locale": "en_US",
  };
};

/**
 * Generate Twitter Card tags
 */
export const generateTwitterTags = (config: SEOConfig) => {
  const seo = { ...DEFAULT_SEO_CONFIG, ...config };

  return {
    "twitter:card": "summary_large_image",
    "twitter:title": seo.title,
    "twitter:description": seo.description,
    "twitter:image": seo.image,
    "twitter:creator": seo.twitterHandle || "@CodeNovaAI",
  };
};

/**
 * Generate JSON-LD Schema Markup
 */
export const generateSchemaMarkup = (config: SEOConfig, type: "Organization" | "WebSite" | "BreadcrumbList" = "WebSite") => {
  const seo = { ...DEFAULT_SEO_CONFIG, ...config };

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  };

  if (type === "Organization") {
    return {
      ...baseSchema,
      name: "CodeNova AI",
      url: seo.url,
      logo: "https://ai-powered-coding-platform.vercel.app/logo.png",
      description: seo.description,
      sameAs: [
        "https://twitter.com/CodeNovaAI",
        "https://linkedin.com/company/codenova-ai",
        "https://github.com/CodeNovaAI",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@codenova.ai",
      },
    };
  } else if (type === "WebSite") {
    return {
      ...baseSchema,
      name: "CodeNova AI",
      url: seo.url,
      description: seo.description,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${seo.url}/search?q={search_term_string}`,
        },
        query_input: "required name=search_term_string",
      },
    };
  } else if (type === "BreadcrumbList") {
    return {
      ...baseSchema,
      itemListElement: [],
    };
  }

  return baseSchema;
};

/**
 * Generate Canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = "https://ai-powered-coding-platform.vercel.app";
  return `${baseUrl}${path}`;
};

/**
 * Page-specific SEO configs
 */
export const PAGE_SEO_CONFIGS = {
  home: {
    title: "CodeNova AI - Master Coding with AI-Powered Learning",
    description:
      "Learn to code smarter with AI assistance. Solve problems, practice coding, participate in contests, and prepare for interviews with CodeNova AI.",
    keywords: [
      "learn coding",
      "online programming",
      "AI coding assistant",
      "competitive programming",
      "interview prep",
    ],
  },
  problems: {
    title: "Coding Problems & Solutions - CodeNova AI",
    description:
      "Solve hundreds of coding problems with AI-powered hints and explanations. Perfect for interview prep and skill improvement.",
    keywords: ["coding problems", "algorithm practice", "coding challenges", "DSA"],
  },
  contests: {
    title: "Coding Contests & Competitions - CodeNova AI",
    description:
      "Participate in real-time coding contests. Compete with programmers worldwide and win prizes on CodeNova AI.",
    keywords: ["coding contests", "competitive programming", "coding competition", "prizes"],
  },
  compiler: {
    title: "Online Code Compiler & IDE - CodeNova AI",
    description:
      "Write, compile, and run code in multiple programming languages. Fast, reliable online compiler with AI assistance.",
    keywords: ["online compiler", "code editor", "online IDE", "programming IDE"],
  },
  ai_assistant: {
    title: "AI Coding Assistant - Real-Time Help - CodeNova AI",
    description:
      "Get instant AI-powered help with your coding problems. Debug code, explain concepts, and improve your skills.",
    keywords: ["AI assistant", "coding help", "code debugging", "programming help"],
  },
  interview_prep: {
    title: "Interview Preparation - CodeNova AI",
    description:
      "Prepare for tech interviews with AI interviewer, mock interviews, and comprehensive problem solutions.",
    keywords: ["interview prep", "mock interview", "coding interview", "tech interview"],
  },
  pricing: {
    title: "Pricing Plans - CodeNova AI",
    description:
      "Choose the perfect plan for your learning. Free, Pro, and Enterprise plans available with all features.",
    keywords: ["pricing", "subscription", "plans", "features"],
  },
};

/**
 * Check if page is indexable (should be crawled by search engines)
 */
export const isPageIndexable = (path: string): boolean => {
  const nonIndexablePaths = ["/admin", "/api", "/auth/login", "/auth/signup", "/dashboard"];
  return !nonIndexablePaths.some((p) => path.startsWith(p));
};

/**
 * Get robots meta tag value
 */
export const getRobotsMetaValue = (path: string): string => {
  if (!isPageIndexable(path)) {
    return "noindex, nofollow";
  }
  return "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
};
