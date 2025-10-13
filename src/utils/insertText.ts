export const insertText = (
  element: HTMLInputElement | HTMLTextAreaElement,
  start: number,
  end: number,
  value: string,
) => {
  element.setSelectionRange(start, end);
  if (value === "" && element.value.length === end - start) {
    // 文字数が0になる場合は、操作不能に陥る不具合があるため
    // execCommandで一度スペースを挿入してから削除する
    document.execCommand("insertText", false, " ");
    element.setSelectionRange(0, 1);
    document.execCommand("delete");
  } else if (value === "") {
    document.execCommand("delete");
  } else {
    // ブラウザのテキスト変更履歴にのせるため、execCommandを使用
    document.execCommand("insertText", false, value);
  }
  // ユーザーが書き換えた時と同等のイベントを発火
  element.dispatchEvent(new InputEvent("input", { bubbles: true }));
};
