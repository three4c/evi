const SCROLL_PADDING_LINES = 2;
const DEFAULT_LINE_HEIGHT = 16;

/**
 * キャレットが画面内に見えるようにtextareaをスクロールする
 * textarea要素のみ対応（input要素はスクロール非対応）
 * テキストの折り返しを考慮して正確な位置を計算する
 *
 * @param element - inputまたはtextarea要素
 * @param caretPosition - キャレット位置（選択範囲の開始位置）
 */
export const scrollToCaret = (
  element: HTMLInputElement | HTMLTextAreaElement,
  caretPosition: number,
) => {
  // textarea要素のみスクロール対応
  if (!(element instanceof HTMLTextAreaElement)) return;

  // 計算スタイルから行の高さを取得
  const style = window.getComputedStyle(element);
  const lineHeight =
    Number.parseFloat(style.lineHeight) ||
    Number.parseFloat(style.fontSize) ||
    DEFAULT_LINE_HEIGHT;

  // 折り返しを考慮してキャレットの実際のY位置を計算
  const caretTop = getCaretTopPosition(element, caretPosition, style);

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

/**
 * テキストの折り返しを考慮してキャレットの実際のY位置を取得
 * 測定用の一時div要素を使用してtextareaと同じレンダリング結果を得る
 *
 * @param element - textarea要素
 * @param caretPosition - キャレット位置
 * @param style - textareaの計算済みスタイル
 * @returns キャレットのY位置（ピクセル）
 */
const getCaretTopPosition = (
  element: HTMLTextAreaElement,
  caretPosition: number,
  style: CSSStyleDeclaration,
) => {
  // 測定用の一時div要素を作成
  const measureDiv = document.createElement("div");

  // textareaと同じスタイルを適用（折り返し動作を再現）
  measureDiv.style.position = "absolute";
  measureDiv.style.visibility = "hidden";
  measureDiv.style.whiteSpace = "pre-wrap"; // textareaと同じ折り返し動作
  measureDiv.style.wordWrap = "break-word";
  measureDiv.style.overflowWrap = style.overflowWrap;
  measureDiv.style.width = style.width;
  measureDiv.style.fontFamily = style.fontFamily;
  measureDiv.style.fontSize = style.fontSize;
  measureDiv.style.fontWeight = style.fontWeight;
  measureDiv.style.fontStyle = style.fontStyle;
  measureDiv.style.lineHeight = style.lineHeight;
  measureDiv.style.letterSpacing = style.letterSpacing;
  measureDiv.style.padding = style.padding;
  measureDiv.style.border = style.border;
  measureDiv.style.boxSizing = style.boxSizing;

  // キャレット位置までのテキストをコピー
  const textBeforeCaret = element.value.substring(0, caretPosition);
  measureDiv.textContent = textBeforeCaret;

  // DOMに追加して測定
  document.body.appendChild(measureDiv);
  const height = measureDiv.scrollHeight;
  document.body.removeChild(measureDiv);

  // paddingTopを引いた実際のテキスト高さを返す
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  return height - paddingTop;
};
