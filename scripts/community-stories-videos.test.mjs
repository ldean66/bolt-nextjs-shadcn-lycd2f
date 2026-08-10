import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync('components/ui/CommunityStoriesSection.tsx', 'utf8');

test('renders two caption-free MP4 volunteer testimonials in the carousel', () => {
  assert.match(source, /mediaType: 'instagram-embed' \| 'image' \| 'video'/);
  assert.equal((source.match(/badge: 'Volunteer Testimonial'/g) ?? []).length, 2);
  assert.match(source, /\/vid\/volunteer-testimonial-1\.mp4/);
  assert.match(source, /\/vid\/volunteer-testimonial-2\.mp4/);
  assert.doesNotMatch(source, /An anonymous volunteer/);
  assert.match(source, /<video/);
  assert.match(source, /controls/);
  assert.match(source, /preload="metadata"/);
  assert.match(source, /aria-label=\{story\.alt\}/);
  assert.match(source, /story\.mediaType !== 'video' \? \(/);
  assert.equal(existsSync('public/vid/volunteer-testimonial-1.mp4'), true);
  assert.equal(existsSync('public/vid/volunteer-testimonial-2.mp4'), true);
  assert.equal(existsSync('public/vid/volunteer-testimonial-1.mov'), false);
  assert.equal(existsSync('public/vid/volunteer-testimonial-2.mov'), false);
});
