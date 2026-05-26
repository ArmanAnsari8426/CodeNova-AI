# 🚀 Quick Reference: Adding SEO to Your Pages

## 30-Second Setup for Any Page

### Basic Template
```tsx
import { SEOHead } from "@/components/seo/SEOHead";

export default function MyPage() {
  return (
    <>
      <SEOHead 
        config={{
          title: "Page Title | CodeNova AI",
          description: "Brief page description (155-160 chars)",
          keywords: ["keyword1", "keyword2", "keyword3"],
          image: "https://ai-powered-coding-platform.vercel.app/og-image.jpg",
        }}
        path="/my-page"
      />
      
      {/* Your page content */}
      <div>Page Content</div>
    </>
  );
}
```

---

## Pre-configured Pages

### Using PAGE_SEO_CONFIGS (Easiest)
```tsx
import { SEOHead } from "@/components/seo/SEOHead";
import { PAGE_SEO_CONFIGS } from "@/utils/seo";

// Homepage
export default function Landing() {
  return (
    <>
      <SEOHead config={PAGE_SEO_CONFIGS.home} path="/" />
      <div>Landing Content</div>
    </>
  );
}

// Problems Page
export default function Problems() {
  return (
    <>
      <SEOHead config={PAGE_SEO_CONFIGS.problems} path="/problems" />
      <div>Problems Content</div>
    </>
  );
}

// Contests Page
export default function Contests() {
  return (
    <>
      <SEOHead config={PAGE_SEO_CONFIGS.contests} path="/contests" />
      <div>Contests Content</div>
    </>
  );
}
```

---

## Available Pre-configured Configs

```typescript
PAGE_SEO_CONFIGS = {
  home: { ... },
  problems: { ... },
  contests: { ... },
  compiler: { ... },
  ai_assistant: { ... },
  interview_prep: { ... },
  pricing: { ... },
}
```

---

## Custom Page Example

```tsx
interface ProblemDetailProps {
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function ProblemDetail({ 
  problemId, 
  problemTitle, 
  problemDescription,
  difficulty 
}: ProblemDetailProps) {
  return (
    <>
      <SEOHead 
        config={{
          title: `${problemTitle} | LeetCode-style | CodeNova AI`,
          description: `${problemTitle} (${difficulty}) - ${problemDescription.substring(0, 120)}...`,
          keywords: [
            problemTitle.toLowerCase(),
            difficulty.toLowerCase(),
            "coding problem",
            "algorithm",
            "practice",
          ],
          type: "article",
          url: `https://ai-powered-coding-platform.vercel.app/problems/${problemId}`,
        }}
        path={`/problems/${problemId}`}
      />
      
      {/* Problem detail content */}
    </>
  );
}
```

---

## Blog Post Example

```tsx
interface BlogPostProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  image: string;
}

export default function BlogPost({ 
  slug, 
  title, 
  excerpt, 
  author,
  publishedDate,
  image
}: BlogPostProps) {
  return (
    <>
      <SEOHead 
        config={{
          title: `${title} | CodeNova AI Blog`,
          description: excerpt,
          keywords: [
            "coding",
            "tutorial",
            title.toLowerCase(),
            "programming",
          ],
          type: "article",
          author: author,
          publishedDate: publishedDate,
          url: `https://ai-powered-coding-platform.vercel.app/blog/${slug}`,
          image: image,
        }}
        schemaType="BreadcrumbList"
        path={`/blog/${slug}`}
      />
      
      {/* Blog post content */}
    </>
  );
}
```

---

## Contest Page Example

```tsx
interface ContestProps {
  contestId: string;
  contestName: string;
  duration: number;
  problemCount: number;
  difficulty: string;
  startDate: string;
}

export default function ContestDetail({ 
  contestId,
  contestName, 
  duration, 
  problemCount,
  difficulty,
  startDate
}: ContestProps) {
  return (
    <>
      <SEOHead 
        config={{
          title: `${contestName} - Live Coding Contest | CodeNova AI`,
          description: `Join ${contestName}: ${problemCount} problems, ${duration} minutes. ${difficulty} level. Starting ${startDate}`,
          keywords: [
            "coding contest",
            "live competition",
            "competitive programming",
            contestName.toLowerCase(),
          ],
          image: "https://ai-powered-coding-platform.vercel.app/contest-og.jpg",
        }}
        path={`/contests/${contestId}`}
      />
      
      {/* Contest details */}
    </>
  );
}
```

---

## Interview Prep Page Example

```tsx
interface InterviewPrepProps {
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: number;
}

export default function InterviewPrep({ 
  topic, 
  difficulty,
  questions
}: InterviewPrepProps) {
  return (
    <>
      <SEOHead 
        config={{
          title: `${topic} Interview Questions - Ace Your ${topic} Interview | CodeNova AI`,
          description: `Practice ${questions} ${topic} interview questions. ${difficulty} level. Perfect for FAANG preparation.`,
          keywords: [
            `${topic.toLowerCase()} interview`,
            "interview preparation",
            "FAANG interview",
            "system design",
            "DSA",
          ],
          type: "article",
        }}
        path={`/learn/interview-prep/${topic.toLowerCase()}`}
      />
      
      {/* Interview prep content */}
    </>
  );
}
```

---

## SEO Configuration Template

```typescript
interface SEOConfig {
  title: string;              // 30-60 characters, include brand
  description: string;        // 155-160 characters
  keywords?: string[];        // 5-10 relevant keywords
  image?: string;            // OG image URL (1200x630px recommended)
  url?: string;              // Full URL of page
  type?: "website" | "article" | "product"; // Page type
  author?: string;           // Author name
  publishedDate?: string;    // ISO date format
  updatedDate?: string;      // ISO date format
  robots?: string;           // Indexing rules
  twitterHandle?: string;    // Twitter handle
}
```

---

## What Gets Automatically Added

### 1. Meta Tags
```html
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="robots" content="index, follow" />
<meta name="author" content="CodeNova AI" />
<title>Your Title | CodeNova AI</title>
<link rel="canonical" href="..." />
```

### 2. Open Graph Tags
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
```

### 3. Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

### 4. JSON-LD Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CodeNova AI",
  ...
}
```

---

## Best Title Formats

### Homepage
```
CodeNova AI - Master Coding with AI-Powered Learning
```

### Feature Pages
```
[Feature Name] - CodeNova AI
Problems & Solutions - CodeNova AI
Live Coding Contests - CodeNova AI
```

### Blog Posts
```
[Article Title] - CodeNova AI Blog
Interview Preparation Tips - CodeNova AI Blog
```

### Product Pages
```
[Product Name] - Pricing & Plans | CodeNova AI
Pro Plan - Unlimited Access | CodeNova AI
```

---

## Best Description Format

### Keep 155-160 characters
```
"Learn to code faster with AI assistance. Solve problems, practice coding, 
ace interviews - all in one platform. Perfect for beginners & experienced devs."
```

### Structure
1. **Hook** (what it is)
2. **Key features** (what you can do)
3. **Benefit** (why you should care)

---

## Common Mistakes to Avoid

❌ **Too Long Titles**
```
"Welcome to Our Amazing AI-Powered Coding Platform for Learning Programming"
```
✅ **Good Title**
```
"CodeNova AI - Learn Coding with AI Assistance"
```

❌ **Keyword Stuffing**
```
"coding coding coding problems contest programming DSA algorithm"
```
✅ **Natural Keywords**
```
["coding problems", "DSA practice", "interview prep"]
```

❌ **Generic Descriptions**
```
"This is a great website for coders"
```
✅ **Specific Description**
```
"Practice 1000+ coding problems with AI hints, join live contests, prepare 
for tech interviews - all on CodeNova AI"
```

---

## Testing Your SEO

### 1. Check Meta Tags (DevTools)
```bash
# F12 > Elements > head section
# Should see all meta tags
```

### 2. Test Open Graph
```
https://developers.facebook.com/tools/debug/sharing
# Paste your URL, check preview
```

### 3. Test Twitter Card
```
https://cards-dev.twitter.com/validator
# Paste your URL, verify card appears
```

### 4. Test Schema
```
https://search.google.com/test/rich-results
# Paste your URL, check for errors
```

---

## Adding to Existing Pages

### Current Landing.tsx
```tsx
import { SEOHead } from "@/components/seo/SEOHead";
import { PAGE_SEO_CONFIGS } from "@/utils/seo";

export default function Landing() {
  return (
    <>
      {/* Add this line */}
      <SEOHead config={PAGE_SEO_CONFIGS.home} path="/" />
      
      {/* Existing content */}
      <Navbar />
      {/* ... rest of component */}
    </>
  );
}
```

### Current Problems.tsx
```tsx
import { SEOHead } from "@/components/seo/SEOHead";
import { PAGE_SEO_CONFIGS } from "@/utils/seo";

export default function Problems() {
  return (
    <>
      {/* Add this line */}
      <SEOHead config={PAGE_SEO_CONFIGS.problems} path="/problems" />
      
      {/* Existing content */}
      {/* ... rest of component */}
    </>
  );
}
```

---

## Files Created for You

```
✅ public/robots.txt - Search engine crawling rules
✅ public/sitemap.xml - All pages for indexing
✅ src/utils/seo.ts - SEO utilities & configs
✅ src/components/seo/SEOHead.tsx - SEO component
✅ scripts/generate-sitemap.js - Dynamic sitemap generator
✅ vercel.json - Vercel deployment config
✅ index.html - Updated with verification meta tag placeholder
✅ docs/SEO_SETUP_GUIDE.md - Comprehensive guide
✅ docs/VERIFICATION_CHECKLIST.md - Testing checklist
✅ docs/QUICK_REFERENCE.md - This file!
```

---

## Next Steps

1. ✅ Add `<SEOHead>` component to your main pages
2. ✅ Get Google verification code from Search Console
3. ✅ Update `index.html` with actual verification code
4. ✅ Deploy: `git push origin main`
5. ✅ Verify in Google Search Console
6. ✅ Submit sitemap
7. ✅ Monitor indexing status

---

**Happy SEO! 🚀**
