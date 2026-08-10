# Volunteer Testimonial Videos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two anonymous, locally hosted volunteer testimonial videos to the Community Stories carousel.

**Architecture:** Extend the existing `CommunityStory` union with a local `video` variant and let `StoryMedia` render it with the native HTML video player. Store the supplied assets in `public/vid`; preserve all existing Instagram and image behavior.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, Node.js test runner

## Global Constraints

- Keep both volunteers anonymous.
- Use native video controls with no autoplay and `preload="metadata"`.
- Do not crop portrait or landscape videos.
- Do not change existing Instagram or image stories.
- Do not stage or commit unrelated working-tree changes.

---

### Task 1: Add anonymous local-video carousel stories

**Files:**
- Create: `scripts/community-stories-videos.test.mjs`
- Create: `public/vid/volunteer-testimonial-1.mov`
- Create: `public/vid/volunteer-testimonial-2.mov`
- Modify: `components/ui/CommunityStoriesSection.tsx:10-20,94-117,147-193,293-306`

**Interfaces:**
- Consumes: public asset URLs rooted at `/vid/`.
- Produces: `CommunityStory.mediaType` accepting `'video'`; two new anonymous story objects; a native video renderer.

- [ ] **Step 1: Write the failing regression test**

Create a Node test that reads `CommunityStoriesSection.tsx` and asserts that it contains exactly two anonymous testimonial asset paths, the `video` media variant, `<video`, `controls`, `preload="metadata"`, `aria-label={story.alt}`, and a condition hiding the external link for video stories. It must also assert both copied video files exist.

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('components/ui/CommunityStoriesSection.tsx', 'utf8');

test('renders two anonymous volunteer testimonial videos in the carousel', () => {
  assert.match(source, /mediaType: 'instagram-embed' \| 'image' \| 'video'/);
  assert.equal((source.match(/badge: 'Volunteer Testimonial'/g) ?? []).length, 2);
  assert.match(source, /\/vid\/volunteer-testimonial-1\.mov/);
  assert.match(source, /\/vid\/volunteer-testimonial-2\.mov/);
  assert.match(source, /<video/);
  assert.match(source, /controls/);
  assert.match(source, /preload="metadata"/);
  assert.match(source, /aria-label=\{story\.alt\}/);
  assert.match(source, /story\.mediaType !== 'video'/);
  assert.equal(existsSync('public/vid/volunteer-testimonial-1.mov'), true);
  assert.equal(existsSync('public/vid/volunteer-testimonial-2.mov'), true);
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run: `node --test scripts/community-stories-videos.test.mjs`

Expected: FAIL because the component lacks the `video` variant and both public assets are absent.

- [ ] **Step 3: Copy the supplied assets into the public video directory**

Copy `PXL_20260809_163913667.mov` to `public/vid/volunteer-testimonial-1.mov` and `IMG_1260.mov` to `public/vid/volunteer-testimonial-2.mov`. Compare source and destination SHA-256 checksums to confirm exact copies.

- [ ] **Step 4: Add the minimal local-video implementation**

Update `CommunityStory` so `mediaType` accepts `'video'` and make `postUrl` optional. Add two stories with unique IDs, `title: 'Volunteer Experience'`, `badge: 'Volunteer Testimonial'`, anonymous descriptions and alt labels, and the two `/vid/` paths.

In `StoryMedia`, add a video branch before the image branch:

```tsx
<div className="bg-pink-100 p-4">
  <video
    src={story.mediaSrc}
    controls
    preload="metadata"
    playsInline
    aria-label={story.alt}
    className="mx-auto max-h-[70vh] w-full max-w-[540px] rounded-xl bg-black object-contain"
  >
    Your browser does not support embedded videos.
  </video>
</div>
```

Render the existing **Open Story** link only when `story.mediaType !== 'video' && story.postUrl`.

- [ ] **Step 5: Run focused and project verification**

Run:

```bash
node --test scripts/community-stories-videos.test.mjs
npm run lint
npm run build
git diff --check
```

Expected: the focused test passes, lint/build exit successfully, and diff check reports no whitespace errors.

- [ ] **Step 6: Commit only the feature files**

```bash
git add scripts/community-stories-videos.test.mjs \
  components/ui/CommunityStoriesSection.tsx \
  public/vid/volunteer-testimonial-1.mov \
  public/vid/volunteer-testimonial-2.mov \
  docs/superpowers/plans/2026-08-09-volunteer-testimonial-videos.md
git commit -m "Add volunteer testimonial videos"
```

Inspect `git show --stat --oneline HEAD` and `git status --short` to verify unrelated changes were not included.

- [ ] **Step 7: Push the dedicated commits**

Push `main` to `origin`, then confirm the remote branch contains the design and feature commits without staging or committing any other working-tree files.
