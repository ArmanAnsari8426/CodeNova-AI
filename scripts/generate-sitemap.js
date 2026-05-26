/**
 * Dynamic Sitemap Generator for Vite React Application
 * Run this with: node scripts/generate-sitemap.js
 * Place in your project root or scripts folder
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://ai-powered-coding-platform.vercel.app";

// Define all routes with their metadata
const routes = [
  { path: "/", changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/problems", changefreq: "daily", priority: 0.9, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/contests", changefreq: "daily", priority: 0.9, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/compiler", changefreq: "weekly", priority: 0.85, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/ai-assistant", changefreq: "weekly", priority: 0.85, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/leaderboard", changefreq: "daily", priority: 0.8, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/learn/roadmap", changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString().split("T")[0] },
  {
    path: "/learn/interview-prep",
    changefreq: "weekly",
    priority: 0.8,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/learn/ai-interviewer",
    changefreq: "weekly",
    priority: 0.75,
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/learn/resume-builder",
    changefreq: "monthly",
    priority: 0.75,
    lastmod: new Date().toISOString().split("T")[0],
  },
  { path: "/company/about", changefreq: "monthly", priority: 0.7, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/company/careers", changefreq: "weekly", priority: 0.7, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/company/contact", changefreq: "monthly", priority: 0.7, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/company/press", changefreq: "monthly", priority: 0.65, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/pricing", changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/blog", changefreq: "weekly", priority: 0.75, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/dashboard", changefreq: "daily", priority: 0.7, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/legal", changefreq: "monthly", priority: 0.5, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/legal/security", changefreq: "monthly", priority: 0.5, lastmod: new Date().toISOString().split("T")[0] },
  { path: "/legal/status", changefreq: "daily", priority: 0.5, lastmod: new Date().toISOString().split("T")[0] },
];

/**
 * Generate XML sitemap
 */
function generateSitemap() {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetStart =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"\n' +
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  const urlEntries = routes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <mobile:mobile/>
  </url>`
    )
    .join("\n");

  const urlsetEnd = "</urlset>\n";

  return xmlHeader + urlsetStart + urlEntries + urlsetEnd;
}

/**
 * Generate robots.txt with sitemap reference
 */
function generateRobots() {
  const content = `# AI-Powered Coding Platform - robots.txt
# Allow all search engines to crawl the website

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /.env

# Specific rules for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Specific rules for Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: DotBot
Disallow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Cache settings (in seconds)
Crawl-delay: 1
Request-rate: 30/1m
`;

  return content;
}

/**
 * Write files
 */
function writeFiles() {
  const publicDir = path.join(__dirname, "..", "public");

  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap.xml
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, generateSitemap());
  console.log(`✅ Sitemap generated: ${sitemapPath}`);

  // Write robots.txt
  const robotsPath = path.join(publicDir, "robots.txt");
  fs.writeFileSync(robotsPath, generateRobots());
  console.log(`✅ Robots.txt generated: ${robotsPath}`);

  console.log("\n📝 Files generated successfully!");
  console.log(`📍 Total routes: ${routes.length}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
}

// Run if executed directly
writeFiles();
