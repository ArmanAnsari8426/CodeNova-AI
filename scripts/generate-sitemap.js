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
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/problems", changefreq: "daily", priority: 0.8 },
  { path: "/contests", changefreq: "daily", priority: 0.8 },
  { path: "/compiler", changefreq: "weekly", priority: 0.8 },
  { path: "/dashboard", changefreq: "daily", priority: 0.9 },
  { path: "/blog", changefreq: "weekly", priority: 0.7 },
  { path: "/pricing", changefreq: "monthly", priority: 0.6 },
  { path: "/company/about", changefreq: "monthly", priority: 0.5 },
  { path: "/company/contact", changefreq: "monthly", priority: 0.5 }
];

/**
 * Generate XML sitemap
 */
function generateSitemap() {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const urlEntries = routes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n");

  const urlsetEnd = "\n</urlset>\n";

  return xmlHeader + urlsetStart + urlEntries + urlsetEnd;
}

/**
 * Generate robots.txt with sitemap reference
 */
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
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
