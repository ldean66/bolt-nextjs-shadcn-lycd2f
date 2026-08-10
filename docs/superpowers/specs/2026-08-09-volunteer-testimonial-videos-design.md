# Volunteer Testimonial Videos Design

## Goal

Add the two supplied volunteer testimonial videos to the existing Community Stories carousel while preserving the current section design and keeping the volunteers anonymous.

## Scope

- Convert both supplied `.mov` files to H.264/AAC `.mp4` files in `public/vid` with clear, anonymous filenames.
- Extend the existing `CommunityStory` media model with a local-video variant.
- Add two new carousel entries titled **Volunteer Experience** and badged **Volunteer Testimonial**.
- Do not show a title or descriptive caption beneath either testimonial video.
- Render each video with the browser's native controls.
- Do not autoplay. Allow sound when the visitor chooses to play the video.
- Keep the existing Instagram and image stories unchanged.

## Component Behavior

`StoryMedia` will select its renderer from `mediaType`:

- `instagram-embed`: preserve the existing Instagram blockquote.
- `image`: preserve the existing Next.js image presentation.
- `video`: render a responsive HTML `<video>` element using the local public asset.

Local video cards will not display the title, descriptive caption, or existing **Open Story** link because their content is played directly in the card. The overlaid **Volunteer Testimonial** badge remains. Instagram and image entries will retain their current text and links.

## Accessibility and Performance

- Each video will have an accessible label describing it as an anonymous volunteer testimonial.
- Native controls will provide play, pause, volume, seeking, and fullscreen behavior.
- `preload="metadata"` will avoid downloading the full videos before the visitor interacts with them.
- Video containers will remain responsive and use `object-contain` so portrait and landscape recordings are not cropped.

## Verification

- Add a focused source-level regression test for the two video entries and video renderer behavior if the project's current test setup supports it without adding unnecessary dependencies.
- Run lint and the production build.
- Confirm the final Git commit contains only this spec, the Community Stories change, and the two video assets; existing unrelated working-tree changes must remain outside the commit.

## Delivery

Create a dedicated commit for this feature and push that commit separately from the user's other local changes.
