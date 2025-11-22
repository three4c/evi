import {
  getTextLength,
  setSelectionRange as setSelection,
} from "./elementHelpers";

export const insertText = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  start: number,
  end: number,
  value: string,
) => {
  // 選択範囲を設定（INPUT/TEXTAREAとcontenteditableの両方に対応）
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    element.setSelectionRange(start, end);
  } else {
    setSelection(element, start, end);
  }

  const textLength = getTextLength(element);

  if (value === "" && textLength === end - start) {
    // 文字数が0になる場合は、操作不能に陥る不具合があるため
    // execCommandで一度スペースを挿入してから削除する
    document.execCommand("insertText", false, " ");
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.setSelectionRange(0, 1);
    } else {
      setSelection(element, 0, 1);
    }
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
