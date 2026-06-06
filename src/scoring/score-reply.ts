type ScoreInput = {
  text: string;
};

const genericPhrases = [
  'great point',
  'this is exactly',
  "couldn't agree more",
  'well said',
  'thanks for sharing',
];

export function scoreReply(input: ScoreInput): number {
  const normalized = input.text.toLowerCase();
  let score = 75;

  if (input.text.length < 20) score -= 10;
  if (input.text.length > 240) score -= 10;

  for (const phrase of genericPhrases) {
    if (normalized.includes(phrase)) score -= 12;
  }

  if (/[\u{1F300}-\u{1FAFF}]/u.test(input.text)) score -= 5;
  if (/(^|\s)#\w+/.test(input.text)) score -= 5;

  return Math.max(0, Math.min(100, score));
}
