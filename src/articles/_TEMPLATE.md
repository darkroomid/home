---
title: "Template — Copy This File to Start a Real Article"
description: "Schema reference only. Filenames starting with _ are excluded by the glob loader pattern in content.config.ts."
pubDate: 2026-07-26
targetKeyword: "example target keyword"
contentCluster: "Gear Reviews & Buying Guides"
schemaType: "Article"
author: "Andrea Ross"
media: []
mediaRightsVerified: false
draft: true
---

Copy this file to a new name (no leading underscore) and fill it in. Each real
article should:

- Be 800–1,500+ words of original commentary, testing, or a hands-on guide.
- Use `contentCluster` matching one of the three confirmed clusters: **Gear Reviews
  & Buying Guides**, **Tutorials & Techniques**, or **Editing & Post-Processing**
  (see the three sample articles alongside this file for a worked example of each).
- Set `heroImage` to a real local photo — ideally one of your own from
  `src/gallery/` or a new one in `src/assets/images/` — via the `image()` schema
  field, not an external placeholder.
- Reference `media: []` (empty) unless every listed asset has a real `rightsNote`
  and `mediaRightsVerified: true` is set — the build will fail otherwise, by
  design. Prefer your own photography; manufacturer product photos and editing-
  software screenshots are the two fair-use exceptions.
- Prefer buyer-intent framing (gear reviews, buying guides, "X vs Y" comparisons)
  over pure inspiration content, to keep RPM toward the upper end of this niche's
  range.
- Flip `draft: false` only after running the content-check script and reviewing
  for depth.
