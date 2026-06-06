export type ReplyVerdict = {
  action: 'hide-for-review';
  score: number;
  text: string;
  element: HTMLElement;
};
