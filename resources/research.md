# Research Notes

Last reviewed: 2026-06-06.

## Browser extension architecture

- Use Manifest V3 because Chrome requires it for modern extensions and Firefox supports WebExtensions with MV3 caveats.
- Use content scripts for reading reply DOM nodes and inserting the review UI. Chrome and MDN both describe content scripts as the extension surface that runs in the context of web pages.
- Use a background service worker for storage, messaging, OAuth, and any future API calls. MV3 service workers do not have DOM access, so page inspection stays in the content script.
- Keep host permissions narrow: `https://x.com/*` and `https://twitter.com/*`.
- Prefer WXT for local iteration because it generates the manifest, supports Chrome and Firefox targets, and gives a unified `browser` API wrapper.

## X/Twitter constraints

- Reading the visible page with a content script is technically feasible, but selectors and DOM shape are private implementation details and can break without notice.
- Automatically clicking the web UI to block accounts is fragile and may look like account automation. Treat this as high risk.
- The official X API has block/unblock endpoints, but it requires developer access and OAuth authorization. This is cleaner technically than DOM-click automation, but still needs explicit user consent and must follow X Developer Policy and Automation Rules.
- The first safe product iteration should hide suspected replies locally and ask the human to confirm account blocking. Fully automatic blocking should remain opt-in and rate-limited after policy review.

## Scoring strategy

Start with a local deterministic score so the extension can be tested without sending post content to a third party:

- Reply text features: length, repeated generic phrases, emoji density, hashtags, links, repetition, punctuation patterns.
- Account features visible on the page: handle age indicators if visible, username/display-name mismatch, profile badge text, follower/following counts when visible.
- Thread context: replies that do not reference the parent post, repeated replies across many posts, identical text from different accounts.
- Human feedback: every `let` or `block` decision should be stored locally as training/evaluation data.

Later options:

- Optional local model or remote classifier, with clear privacy controls.
- Optional X API integration for blocking, only after OAuth and consent UX are implemented.

## Useful sources

- Chrome Extensions docs: https://developer.chrome.com/docs/extensions/mv3/getstarted
- Chrome permissions docs: https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- MDN WebExtensions docs: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- MDN content scripts: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts
- MDN Chrome incompatibilities and `browser` namespace notes: https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities
- WXT docs: https://wxt.dev/
- WXT manifest docs: https://wxt.dev/guide/essentials/config/manifest.html
- WXT browser targeting docs: https://wxt.dev/guide/essentials/target-different-browsers.html
- X API blocks docs: https://docs.x.com/x-api/users/blocks/introduction
- X Developer Policy: https://docs.x.com/developer-terms/policy
- X Automation Rules: https://help.x.com/articles/76915-automation-rules-and-best-practices

