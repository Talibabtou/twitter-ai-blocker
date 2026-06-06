import { scoreReply } from '../scoring/score-reply';
import type { ReplyVerdict } from '../types';

type ScannerOptions = {
  onVerdict: (verdict: ReplyVerdict) => void;
};

export function createReplyScanner(options: ScannerOptions) {
  const seen = new WeakSet<Element>();
  let observer: MutationObserver | undefined;

  function scan() {
    for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
      if (seen.has(article)) continue;
      seen.add(article);

      const text = article.textContent?.trim() ?? '';
      if (!text) continue;

      const score = scoreReply({ text });
      if (score <= 30) {
        (article as HTMLElement).style.display = 'none';
        options.onVerdict({
          action: 'hide-for-review',
          score,
          text,
          element: article as HTMLElement,
        });
      }
    }
  }

  return {
    start() {
      scan();
      observer = new MutationObserver(scan);
      observer.observe(document.body, { childList: true, subtree: true });
    },
    stop() {
      observer?.disconnect();
    },
  };
}

