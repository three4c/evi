import { getLines } from "@/utils";

const SCROLL_PADDING_LINES = 2;
const DEFAULT_LINE_HEIGHT = 16;

/**
 * キャレットが画面内に見えるようにtextareaをスクロールする
 * textarea要素のみ対応（input要素はスクロール非対応）
 *
 * @param element - inputまたはtextarea要素
 * @param caretPosition - キャレット位置（選択範囲の開始位置）
 */
export const scrollToCaret = (
  element: HTMLInputElement | HTMLTextAreaElement,
  caretPosition: number,
): void => {
  // textarea要素のみスクロール対応
  if (!(element instanceof HTMLTextAreaElement)) return;

  // 既存のユーティリティを使って行情報を取得（currentLineは0-based）
  const { currentLine } = getLines(element, caretPosition);

  // 計算スタイルから行の高さを取得
  const style = window.getComputedStyle(element);
  const lineHeight =
    Number.parseFloat(style.lineHeight) ||
    Number.parseFloat(style.fontSize) ||
    DEFAULT_LINE_HEIGHT;

  // 位置を計算
  const caretTop = currentLine * lineHeight;
  const scrollTop = element.scrollTop;
  const clientHeight = element.clientHeight;
  const padding = lineHeight * SCROLL_PADDING_LINES;

  // キャレットが上端に近い場合は上にスクロール
  if (caretTop < scrollTop + padding) {
    element.scrollTop = Math.max(0, caretTop - padding);
  }
  // キャレットが下端に近い場合は下にスクロール
  else if (caretTop + lineHeight > scrollTop + clientHeight - padding) {
    element.scrollTop = caretTop + lineHeight - clientHeight + padding;
  }
};
