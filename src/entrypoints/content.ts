import { createReplyScanner } from '../content/reply-scanner';
import { mountReviewBuffer } from '../ui/review-buffer';

export default defineContentScript({
  matches: ['https://x.com/*', 'https://twitter.com/*'],
  runAt: 'document_idle',
  main() {
    const buffer = mountReviewBuffer();
    const scanner = createReplyScanner({
      onVerdict(verdict) {
        if (verdict.action === 'hide-for-review') {
          buffer.add(verdict);
        }
      },
    });

    scanner.start();
  },
});
