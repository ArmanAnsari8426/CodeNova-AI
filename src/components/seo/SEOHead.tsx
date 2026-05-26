import { useEffect } from "react";
import {
  SEOConfig,
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterTags,
  generateSchemaMarkup,
  getCanonicalUrl,
  getRobotsMetaValue,
  DEFAULT_SEO_CONFIG,
} from "@/utils/seo";

interface SEOHeadProps {
  config?: Partial<SEOConfig>;
  schemaType?: "Organization" | "WebSite" | "BreadcrumbList";
  path?: string;
}

/**
 * SEO Head Component
 * Updates document head with all necessary meta tags, Open Graph, Twitter cards, and schema markup
 *
 * Usage:
 * <SEOHead config={{ title: "Page Title", description: "Page description" }} />
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  config = {},
  schemaType = "WebSite",
  path = "/",
}) => {
  useEffect(() => {
    const seoConfig: SEOConfig = { ...DEFAULT_SEO_CONFIG, ...config };
    const metaTags = generateMetaTags(seoConfig);
    const ogTags = generateOpenGraphTags(seoConfig);
    const twitterTags = generateTwitterTags(seoConfig);
    const schemaMarkup = generateSchemaMarkup(seoConfig, schemaType);

    // Update title
    document.title = metaTags.title;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, attribute = "name") => {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Update standard meta tags
    updateMetaTag("description", metaTags.description);
    updateMetaTag("keywords", metaTags.keywords || "");
    updateMetaTag("robots", getRobotsMetaValue(path));
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0");
    updateMetaTag("author", "CodeNova AI");
    updateMetaTag("theme-color", "#6366f1");

    // Update Open Graph tags
    Object.entries(ogTags).forEach(([key, value]) => {
      updateMetaTag(key, value, "property");
    });

    // Update Twitter tags
    Object.entries(twitterTags).forEach(([key, value]) => {
      updateMetaTag(key, value, "name");
    });

    // Add canonical URL
    const canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (canonical) {
      canonical.href = getCanonicalUrl(path);
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = getCanonicalUrl(path);
      document.head.appendChild(link);
    }

    // Add alternate mobile link
    const alternateMobile = document.querySelector("link[rel='alternate'][media]") as HTMLLinkElement;
    if (!alternateMobile) {
      const mobileLink = document.createElement("link");
      mobileLink.rel = "alternate";
      mobileLink.media = "only screen and (max-width: 640px)";
      mobileLink.href = getCanonicalUrl(path);
      document.head.appendChild(mobileLink);
    }

    // Add Schema markup
    let schemaScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaMarkup);

    // Add preload for critical resources
    const preloadLinks = [
      { rel: "preload", as: "font", href: "fonts/inter.woff2", type: "font/woff2", crossorigin: "anonymous" },
    ];

    preloadLinks.forEach(({ rel, as, href, type, crossorigin }) => {
      if (!document.querySelector(`link[rel="${rel}"][as="${as}"]`)) {
        const link = document.createElement("link");
        link.rel = rel;
        link.as = as;
        link.href = href;
        if (type) link.type = type;
        if (crossorigin) link.crossOrigin = crossorigin;
        document.head.appendChild(link);
      }
    });

    // Add DNS prefetch for external resources
    const dnsPrefetchUrls = [
      "https://cdn.example.com",
      "https://analytics.google.com",
      "https://connect.facebook.net",
    ];

    dnsPrefetchUrls.forEach((url) => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "dns-prefetch";
        link.href = url;
        document.head.appendChild(link);
      }
    });

  }, [config, schemaType, path]);

  return null;
};

export default SEOHead;
