type BlogTone = "beginner" | "intermediate" | "advanced";

interface BlogPromptOptions {
  title: string;
  keywords?: string[];
  tone?: BlogTone;
}

export const generateBlogPrompt = ({
  title,
  keywords = [],
  tone = "beginner",
}: BlogPromptOptions) => {
  return `
You are a senior SEO-focused technical content writer.

Your job is to write a high-quality, structured, and engaging blog post.

---

## Topic
"${title}"

${keywords.length ? `## SEO Keywords (naturally include these)\n${keywords.join(", ")}` : ""}

---

## Tone
Write in a ${tone} friendly tone:
- Clear and easy to understand
- Avoid unnecessary jargon
- Explain concepts step-by-step
- Keep it engaging and practical

---

## Output Rules (STRICT)

- Return ONLY valid HTML
- Do NOT include: <html>, <head>, <body>, Markdown, CSS, JavaScript
- Do NOT include explanations outside HTML
- Output must be clean, production-ready HTML

---

## SEO Requirements

- Naturally include the title in:
  - Introduction
  - At least one heading
- Use keywords naturally (no keyword stuffing)
- Keep content useful and readable
- Focus on search intent and clarity

---

## Recommended Structure

<h2>Introduction</h2>
<p>Hook the reader and explain what they will learn.</p>

<h2>What is ${title}?</h2>
<p>Clear definition and simple explanation.</p>

<h2>How It Works</h2>
<p>Break down the concept step by step.</p>

<h3>Key Concepts</h3>
<ul>
  <li>Important point 1</li>
  <li>Important point 2</li>
  <li>Important point 3</li>
</ul>

<h3>Example (if applicable)</h3>
<pre><code>
// Simple real-world or code example
</code></pre>

<h2>Benefits / Use Cases</h2>
<ul>
  <li>Use case 1</li>
  <li>Use case 2</li>
  <li>Use case 3</li>
</ul>

<h2>Common Mistakes</h2>
<blockquote>
Explain common pitfalls or misunderstandings.
</blockquote>

<h2>Conclusion</h2>
<p>Summarize key takeaways clearly and simply.</p>

---

## Allowed HTML Tags Only

<h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <pre>, <code>

---

## Content Rules

- 700–1000 words preferred
- No fluff or filler content
- Must be informative and practical
- Must include real-world explanation or analogy
- Avoid repetition across sections
- Keep paragraphs short and readable

---
`;
};
