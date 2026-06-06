import type { ReplyVerdict } from '../types';
import './review-buffer.css';

export function mountReviewBuffer() {
  const root = document.createElement('section');
  root.className = 'taib-review-buffer';
  root.innerHTML = `
    <button class="taib-review-toggle" type="button">Review suspected AI replies (0)</button>
    <div class="taib-review-list" hidden></div>
  `;
  document.documentElement.append(root);

  const toggle = root.querySelector<HTMLButtonElement>('.taib-review-toggle');
  const list = root.querySelector<HTMLDivElement>('.taib-review-list');
  const items: ReplyVerdict[] = [];

  toggle?.addEventListener('click', () => {
    if (list) list.hidden = !list.hidden;
  });

  function render() {
    if (!toggle || !list) return;
    toggle.textContent = `Review suspected AI replies (${items.length})`;
    list.replaceChildren(
      ...items.map((item) => {
        const row = document.createElement('article');
        row.className = 'taib-review-item';
        row.textContent = `${item.score}/100: ${item.text}`;
        return row;
      }),
    );
  }

  return {
    add(verdict: ReplyVerdict) {
      items.push(verdict);
      render();
    },
  };
}

