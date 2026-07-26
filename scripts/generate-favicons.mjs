#!/usr/bin/env node
// One-off/rerunnable generator for public/favicons/*. BaseHead.astro and
// GalleryLayout.astro reference favicon-96x96.png, favicon.ico,
// apple-touch-icon.png, and site.webmanifest.
//
// Source is a raster PNG (favicon-source.png, 1024x1024), not a vector — so
// there's no SVG favicon variant generated here (see the removed
// `<link rel="icon" type="image/svg+xml">` in both layouts). Re-run this
// after favicon-source.png changes.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const FAVICON_DIR = join(ROOT, "public/favicons");
const SOURCE_PATH = join(FAVICON_DIR, "favicon-source.png");

mkdirSync(FAVICON_DIR, { recursive: true });

const source = readFileSync(SOURCE_PATH);

async function pngBuffer(size) {
	return sharp(source).resize(size, size).png().toBuffer();
}

// Wraps a single PNG image in a minimal valid .ico container (ICO supports
// embedding PNG-compressed image data directly — supported by every modern
// browser — so this avoids needing a real ICO encoder/ImageMagick, neither of
// which is available in this environment).
function icoFromPng(pngBuf, size) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: 1 = icon
	header.writeUInt16LE(1, 4); // number of images

	const entry = Buffer.alloc(16);
	entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
	entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256)
	entry.writeUInt8(0, 2); // color palette
	entry.writeUInt8(0, 3); // reserved
	entry.writeUInt16LE(1, 4); // color planes
	entry.writeUInt16LE(32, 6); // bits per pixel
	entry.writeUInt32LE(pngBuf.length, 8); // image data size
	entry.writeUInt32LE(header.length + entry.length, 12); // offset

	return Buffer.concat([header, entry, pngBuf]);
}

async function main() {
	const png32 = await pngBuffer(32);
	const png96 = await pngBuffer(96);
	const png180 = await pngBuffer(180);
	const png192 = await pngBuffer(192);
	const png512 = await pngBuffer(512);

	writeFileSync(join(FAVICON_DIR, "favicon-96x96.png"), png96);
	writeFileSync(join(FAVICON_DIR, "apple-touch-icon.png"), png180);
	writeFileSync(join(FAVICON_DIR, "favicon.ico"), icoFromPng(png32, 32));
	writeFileSync(join(FAVICON_DIR, "icon-192.png"), png192);
	writeFileSync(join(FAVICON_DIR, "icon-512.png"), png512);

	const manifest = {
		name: "Darkroom.id",
		short_name: "Darkroom",
		icons: [
			{ src: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ src: "/favicons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/favicons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		theme_color: "#7a5a3a",
		background_color: "#fdfaf5",
		display: "standalone",
	};
	writeFileSync(join(FAVICON_DIR, "site.webmanifest"), JSON.stringify(manifest, null, 2) + "\n");

	console.log(
		"Generated favicon-96x96.png, apple-touch-icon.png, favicon.ico, icon-192.png, icon-512.png, site.webmanifest",
	);
}

main();
