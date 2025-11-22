/**
 * INPUT/TEXTAREAとcontenteditable要素の違いを吸収するヘルパー関数群
 */

/**
 * 要素がcontenteditableかどうかを判定
 */
export const isContentEditable = (
  element: Element | null,
): element is HTMLElement => {
  return element instanceof HTMLElement && element.isContentEditable;
};

/**
 * 要素からテキスト内容を取得（INPUT、TEXTAREA、contenteditableに対応）
 */
export const getText = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
): string => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element.value;
  }

  // contenteditableの場合、HTMLをプレーンテキストに変換
  // <br>と<div>を改行に置換
  const clone = element.cloneNode(true) as HTMLElement;

  // <br>を改行に置換
  clone.querySelectorAll("br").forEach((br) => {
    br.replaceWith("\n");
  });

  // ブロック要素を改行に置換
  clone.querySelectorAll("div, p").forEach((block, index) => {
    if (index > 0) {
      block.prepend(document.createTextNode("\n"));
    }
  });

  return clone.textContent || "";
};

/**
 * 要素のテキストの長さを取得
 */
export const getTextLength = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
): number => {
  return getText(element).length;
};

/**
 * 要素の現在の選択範囲を取得
 */
export const getSelectionRange = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
): { start: number; end: number } => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return {
      start: element.selectionStart ?? 0,
      end: element.selectionEnd ?? 0,
    };
  }

  // contenteditableの場合、window.getSelection()からオフセットを計算
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { start: 0, end: 0 };
  }

  const range = selection.getRangeAt(0);

  // 要素のテキスト内容を基準にした開始・終了オフセットを計算
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(element);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = getTextContentLength(preSelectionRange);

  const end = start + getTextContentLength(range);

  return { start, end };
};

/**
 * 要素の選択範囲を設定
 */
export const setSelectionRange = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  start: number,
  end: number,
): void => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    element.setSelectionRange(start, end);
    return;
  }

  // contenteditableの場合、Range APIを使用
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  const { node: startNode, offset: startOffset } = getNodeAndOffset(
    element,
    start,
  );
  const { node: endNode, offset: endOffset } = getNodeAndOffset(element, end);

  if (startNode && endNode) {
    try {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (_e) {
      // 範囲設定が失敗した場合は、開始位置にカーソルを配置
      range.setStart(startNode, startOffset);
      range.setEnd(startNode, startOffset);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

/**
 * ヘルパー: Rangeのテキスト内容の長さを取得（改行を考慮）
 */
const getTextContentLength = (range: Range): number => {
  const container = document.createElement("div");
  container.appendChild(range.cloneContents());

  // <br>を改行としてカウント
  const brCount = container.querySelectorAll("br").length;

  // ブロック要素を改行としてカウント（最初の要素は除く）
  const blockCount = Math.max(
    0,
    container.querySelectorAll("div, p").length - 1,
  );

  return (container.textContent || "").length + brCount + blockCount;
};

/**
 * ヘルパー: 指定された文字位置に対応するテキストノードとオフセットを検索
 */
const getNodeAndOffset = (
  element: HTMLElement,
  targetOffset: number,
): { node: Node; offset: number } => {
  let currentOffset = 0;

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        // テキストノードと<br>要素を受け入れる
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof Element && node.tagName === "BR") {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let node: Node | null = walker.nextNode();

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length || 0;
      if (currentOffset + textLength >= targetOffset) {
        return {
          node,
          offset: targetOffset - currentOffset,
        };
      }
      currentOffset += textLength;
    } else if (node instanceof Element && node.tagName === "BR") {
      // <br>を1文字（改行）としてカウント
      if (currentOffset + 1 >= targetOffset) {
        // <br>の後にカーソルを配置
        const childNodes = node.parentNode?.childNodes || [];
        const nodeIndex = Array.prototype.findIndex.call(
          childNodes,
          (child) => child === node,
        );
        return {
          node: node.parentNode || element,
          offset: nodeIndex + 1,
        };
      }
      currentOffset += 1;
    }

    node = walker.nextNode();
  }

  // 正確な位置が見つからない場合、最後のテキストノードまたは要素自体を返す
  return {
    node: element.lastChild || element,
    offset: element.lastChild?.textContent?.length || 0,
  };
};
