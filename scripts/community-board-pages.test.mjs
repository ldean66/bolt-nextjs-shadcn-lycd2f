// Run against the local preview: npm run dev -- --port 3100
// Then: node --test scripts/community-board-pages.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = 'http://localhost:3100';
const profiles = [
  ['lydia-dean-reese', 'Lydia Dean-Reese'],
  ['chevelle-jackson', 'Chevelle Jackson'],
  ['deirdre-adams', 'Deirdre Adams'],
  ['janet-mosby', 'Janet Mosby'],
  ['jackie-bromfield', 'Jackie Bromfield'],
  ['linda-goodman', 'Linda Goodman'],
  ['kathy-dejesus', 'Kathy DeJesus'],
  ['doreen-doye', 'Doreen Doye'],
];

test('home features the interview before the news and preserves volunteer videos', async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();
  const interview = html.indexOf('The Heart Behind Our Mission');
  assert.ok(interview >= 0, 'the featured interview is visible in the initial page');
  assert.ok(interview < html.indexOf('Lydia joins two volunteer communities'));
  assert.match(html, /href="https:\/\/www.youtube.com\/watch\?v=xALHifmqVyc"/);
  assert.doesNotMatch(html, /<iframe[^>]+youtube/, 'the player only loads after activation');
  assert.match(html, /src="\/vid\/volunteer-testimonial-1.mp4"/);
  assert.match(html, /src="\/vid\/volunteer-testimonial-2.mp4"/);
  for (const [slug] of profiles) {
    assert.ok(html.includes(`href="/board/${slug}"`), `home links to ${slug}`);
  }
});

for (const [slug, name] of profiles) {
  test(`${name} has a shareable profile with working home links`, async () => {
    const response = await fetch(`${baseUrl}/board/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<h1[^>]*>${name}</h1>`));
    assert.ok(html.includes(`<title>${name} | More Than Conquerors</title>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://morethan-conquerors.com/board/${slug}"`));
    assert.match(html, /href="\/#board-members"/);
    assert.match(html, /href="\/#community-stories"/);
    assert.match(html, /href="\/#about"/);
    // Dropdown links mount when opened; their destinations are checked in the browser.
    assert.ok(html.includes('>Resources<'), 'the resources menu is available');
    assert.match(html, /href="\/#home"/);
  });
}

test('an unknown board member returns a 404', async () => {
  const response = await fetch(`${baseUrl}/board/not-a-board-member`);
  assert.equal(response.status, 404);
});

test('resource images remain rooted at the site when navigating from profiles', async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();
  assert.equal(/url\((?:&#x27;|&quot;|["'])?img\//.test(html), false,
    'relative resource images resolve under /board/ during client navigation');
});
