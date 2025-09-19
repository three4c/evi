export const replaceText = (
  element: HTMLInputElement | HTMLTextAreaElement,
  start: number,
  end: number,
  value: string,
) => {
  element.setSelectionRange(start, end);
  // ブラウザのテキスト変更履歴にのせるため、execCommandを使用
  document.execCommand("insertText", false, value);
  // ユーザーが書き換えた時と同等のイベントを発火
  element.dispatchEvent(new InputEvent("input", { bubbles: true }));
};
