#!/usr/bin/env node
// Content QA — standalone checks, runnable locally and in CI.
// Covers: word-count / thin-content bar, media-rights gate, and a placeholder-text
// sweep. The Zod schema in content.config.ts already enforces the media-rights gate
// at build time; this script gives a human-readable report of the same rule plus
// the checks Zod can't express (word count, leftover editorial placeholders).

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const ARTICLES_DIR = join(process.cwd(), "src/articles");
const MIN_WORD_COUNT = 800;
const PLACEHOLDER_PATTERNS = [/lorem ipsum/i, /\[ANDREA:/i, /editorial note \(remove before publishing\)/i];

function wordCount(markdown) {
	return markdown
		.replace(/```[\s\S]*?```/g, "")
		.split(/\s+/)
		.filter(Boolean).length;
}

function checkArticle(filename) {
	const raw = readFileSync(join(ARTICLES_DIR, filename), "utf-8");
	const { data, content } = matter(raw);
	const issues = [];

	if (data.draft) {
		return { filename, draft: true, issues: [] };
	}

	const words = wordCount(content);
	if (words < MIN_WORD_COUNT) {
		issues.push(`Word count ${words} is below the ${MIN_WORD_COUNT}-word minimum.`);
	}

	if (Array.isArray(data.media) && data.media.length > 0 && !data.mediaRightsVerified) {
		issues.push("References media but mediaRightsVerified is not true — omit the media or record rights.");
	}

	for (const pattern of PLACEHOLDER_PATTERNS) {
		if (pattern.test(content)) {
			issues.push(`Contains placeholder/editorial-note text matching ${pattern} — resolve before publishing.`);
		}
	}

	return { filename, draft: false, issues };
}

function main() {
	const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
	const results = files.map(checkArticle);

	const published = results.filter((r) => !r.draft);
	const drafts = results.filter((r) => r.draft);
	const failing = published.filter((r) => r.issues.length > 0);

	console.log(`Checked ${files.length} file(s): ${published.length} published, ${drafts.length} draft.\n`);

	for (const result of failing) {
		console.log(`✗ ${result.filename}`);
		for (const issue of result.issues) {
			console.log(`  - ${issue}`);
		}
	}

	if (published.length < 15) {
		console.log(
			`\n⚠ Only ${published.length} non-draft article(s) found — the pre-submission bar is ≥15 (google-adsense.md §9).`,
		);
	}

	if (failing.length > 0) {
		console.log(`\n${failing.length} of ${published.length} published article(s) have issues.`);
		process.exitCode = 1;
	} else if (published.length > 0) {
		console.log("\nAll published articles pass content checks.");
	}
}

main();
