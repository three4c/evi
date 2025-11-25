const SCROLL_PADDING_LINES = 2;
const DEFAULT_LINE_HEIGHT = 16;
const SCROLL_PADDING_PX = 32; // ContentEditable用のピクセル単位のパディング

// 測定用div要素のキャッシュ（textarea要素ごとに保持）
const measureDivCache = new WeakMap<HTMLTextAreaElement, HTMLDivElement>();

/**
 * 測定用div要素を取得または作成する
 * 一度作成した要素はキャッシュして再利用する
 *
 * @param element - textarea要素
 * @returns 測定用のdiv要素
 */
const getOrCreateMeasureDiv = (element: HTMLTextAreaElement) => {
  let measureDiv = measureDivCache.get(element);

  if (!measureDiv) {
    measureDiv = document.createElement("div");
    measureDiv.style.position = "absolute";
    measureDiv.style.visibility = "hidden";
    measureDiv.style.whiteSpace = "pre-wrap";
    measureDiv.style.wordWrap = "break-word";
    document.body.appendChild(measureDiv);
    measureDivCache.set(element, measureDiv);
  }

  return measureDiv;
};

/**
 * キャレットが画面内に見えるようにスクロールする
 * textarea要素とcontenteditable要素に対応（input要素はスクロール非対応）
 * テキストの折り返しを考慮して正確な位置を計算する
 *
 * @param element - input、textarea、またはcontenteditable要素
 * @param caretPosition - キャレット位置（選択範囲の開始位置）
 * @returns input要素の場合は何もせずに早期リターンする
 */
export const scrollToCaret = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  caretPosition: number,
) => {
  // input要素はスクロール非対応
  if (element instanceof HTMLInputElement) return;

  // contenteditable要素の場合
  if (element instanceof HTMLElement && element.isContentEditable) {
    scrollToCaretContentEditable(element);
    return;
  }

  // textarea要素の場合
  if (element instanceof HTMLTextAreaElement) {
    // 計算スタイルから行の高さを取得
    const style = window.getComputedStyle(element);
    const lineHeightStr = style.lineHeight;
    const parsedLineHeight = Number.parseFloat(lineHeightStr);
    const lineHeight =
      lineHeightStr === "normal" || Number.isNaN(parsedLineHeight)
        ? Number.parseFloat(style.fontSize) || DEFAULT_LINE_HEIGHT
        : parsedLineHeight;

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
  }
};

/**
 * contenteditable要素のカーソル位置にスクロール
 * Selection APIを使ってカーソルの実際の位置を取得
 *
 * @param element - contenteditable要素
 */
const scrollToCaretContentEditable = (element: HTMLElement) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 要素の表示領域（スクロール領域）に対するカーソルの相対位置
  const caretTopRelative = rect.top - elementRect.top + element.scrollTop;
  const caretBottomRelative = rect.bottom - elementRect.top + element.scrollTop;

  const scrollTop = element.scrollTop;
  const clientHeight = element.clientHeight;

  // カーソルが上端に近い、または見えない場合は上にスクロール
  if (caretTopRelative < scrollTop + SCROLL_PADDING_PX) {
    element.scrollTop = Math.max(0, caretTopRelative - SCROLL_PADDING_PX);
  }
  // カーソルが下端に近い、または見えない場合は下にスクロール
  else if (caretBottomRelative > scrollTop + clientHeight - SCROLL_PADDING_PX) {
    element.scrollTop = caretBottomRelative - clientHeight + SCROLL_PADDING_PX;
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
  // キャッシュされた測定用div要素を取得
  const measureDiv = getOrCreateMeasureDiv(element);

  // textareaと同じスタイルを適用（textarea要素のスタイルが変わる可能性があるため毎回更新）
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

  // 高さを測定（既にDOMに追加済みなので追加・削除不要）
  const height = measureDiv.scrollHeight;

  // scrollHeightはpadding含む全体の高さ
  // textarea.scrollTopはpadding内側のコンテンツエリアからの座標なので
  // paddingTopを引いてコンテンツ高さのみを取得
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  return height - paddingTop;
};
