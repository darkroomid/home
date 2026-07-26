// Converts a human-readable cluster name into a clean, URL-safe slug —
// e.g. "Editing & Post-Processing" -> "editing-post-processing".
// Used instead of encodeURIComponent() for cluster route params: relying on
// percent-encoding of spaces/"&" in a dynamic route segment is fragile across
// Astro dev/build and proved unreliable in practice (404s on the encoded URL
// even when getStaticPaths and the link agreed on the encoding). A plain
// lowercase-hyphenated slug sidesteps that entirely.
export function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/&/g, " ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
