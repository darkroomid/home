import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Type-check frontmatter using a schema
// gallery
// const gallery = defineCollection({
// 	// type: "content",
// 	loader: glob({
// 		pattern: "**/[^_]*.{md,mdx}",
// 		base: "./src/data/gallery",
// 	}),
// 	schema: ({ image }) =>
// 		z.object({
// 			title: z.string(),
// 			description: z.string(),
// 			heroImage: image(),
// 			clients: z.array(z.string()),
// 			location: z.string(),
// 			images: z.array(
// 				z.array(image()).refine((arr) => [1, 2, 3].includes(arr.length), {
// 					message: "Each sub-array must contain 1, 2, or 3 items",
// 				}),
// 			),
// 			// Transform string to Date object
// 			date: z.coerce.date(),
// 			order: z.number(),
// 			// will be excluded from build if draft is "true"
// 			draft: z.boolean().optional(),
// 		}),
// });
//

// other pages
const otherPages = defineCollection({
	// type: "content",
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/otherPages",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			draft: z.boolean().optional(),
		}),
});

// Article Content Model — PRD/TRD (gap assessment, GAP-ASSESSMENT-home.md).
// This is the build-time enforcement layer for the AdSense content requirements
// this site previously had no mechanism to satisfy at all:
//   - word_count / thin-content bar   -> checked by scripts/check-content.mjs
//   - media rights gate               -> enforced below via superRefine
//   - schema_type                     -> feeds the Article JSON-LD in ArticleLayout.astro
//
// contentCluster stays a free-form string (not z.enum) even though the 3 confirmed
// clusters are known (Gear Reviews & Buying Guides / Tutorials & Techniques /
// Editing & Post-Processing) — tighten to z.enum([...]) once real content is flowing,
// so a typo can't silently create a 4th cluster.
const articles = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/articles",
	}),
	schema: ({ image }) =>
		z
			.object({
				title: z.string().min(1).max(110),
				description: z.string().min(1).max(160),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				targetKeyword: z.string().min(1),
				contentCluster: z.string().min(1),
				schemaType: z.enum(["Article", "FAQPage"]).default("Article"),
				author: z.string().default("Andrea Ross"),
				// Cosmetic hero/card image (site chrome, not "content"). A real local
				// asset (astro:assets image()) — prefer one of the existing gallery
				// photos in src/gallery/ or src/assets/images/ over any external
				// placeholder, since this site already has real original photography.
				heroImage: image().optional(),
				heroImageAlt: z.string().optional(),
				// Any image/video referenced IN THE ARTICLE BODY as review/tutorial
				// subject matter (gear photos, product shots, editing screenshots).
				// Prefer the author's own photography; manufacturer product photos and
				// tutorial screenshots are the two fair-use exceptions (see
				// google-adsense.md §8). Leave empty for text-only content.
				media: z
					.array(
						z.object({
							src: z.string(),
							rightsNote: z
								.string()
								.describe(
									"Why this asset is safe to use: license, permission, or the specific fair-use commentary it illustrates.",
								),
						}),
					)
					.default([]),
				// Must be explicitly flipped to true, with a rights note recorded
				// above, before an article referencing media can be published.
				mediaRightsVerified: z.boolean().default(false),
				// Keeps placeholder/template content out of the production build.
				draft: z.boolean().default(true),
			})
			.superRefine((data, ctx) => {
				if (data.media.length > 0 && !data.mediaRightsVerified) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"This article references media but mediaRightsVerified is not true. " +
							"Omit the media or record its rights and set mediaRightsVerified: true before publishing.",
						path: ["mediaRightsVerified"],
					});
				}
			}),
});

export const collections = {
	otherPages,
	articles,
};
