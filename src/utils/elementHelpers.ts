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
  // DOM構造を走査して正確にテキストを抽出
  let text = "";
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (
          node instanceof Element &&
          ["BR", "DIV", "P"].includes(node.tagName)
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let node: Node | null = walker.nextNode();
  let prevWasBlock = false;

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
      prevWasBlock = false;
    } else if (node instanceof Element) {
      if (node.tagName === "BR") {
        text += "\n";
        prevWasBlock = false;
      } else if (["DIV", "P"].includes(node.tagName)) {
        // 最初のブロック要素以外は改行を追加
        if (text.length > 0 && !prevWasBlock) {
          text += "\n";
        }
        prevWasBlock = true;
      }
    }
    node = walker.nextNode();
  }

  return text;
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

  // getText()と同じロジックで長さを計算
  let length = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (
          node instanceof Element &&
          ["BR", "DIV", "P"].includes(node.tagName)
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let node: Node | null = walker.nextNode();
  let prevWasBlock = false;

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      length += node.textContent?.length || 0;
      prevWasBlock = false;
    } else if (node instanceof Element) {
      if (node.tagName === "BR") {
        length += 1;
        prevWasBlock = false;
      } else if (["DIV", "P"].includes(node.tagName)) {
        if (length > 0 && !prevWasBlock) {
          length += 1;
        }
        prevWasBlock = true;
      }
    }
    node = walker.nextNode();
  }

  return length;
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
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (
          node instanceof Element &&
          ["BR", "DIV", "P"].includes(node.tagName)
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let node: Node | null = walker.nextNode();
  let prevWasBlock = false;
  let lastTextNode: Node | null = null;

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
      lastTextNode = node;
      prevWasBlock = false;
    } else if (node instanceof Element) {
      if (node.tagName === "BR") {
        // <br>を1文字（改行）としてカウント
        if (currentOffset >= targetOffset) {
          // <br>の前にカーソルを配置
          const childNodes = node.parentNode?.childNodes || [];
          const nodeIndex = Array.prototype.findIndex.call(
            childNodes,
            (child) => child === node,
          );
          return {
            node: node.parentNode || element,
            offset: nodeIndex,
          };
        }
        if (currentOffset + 1 > targetOffset) {
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
        prevWasBlock = false;
      } else if (["DIV", "P"].includes(node.tagName)) {
        // ブロック要素による改行
        if (currentOffset > 0 && !prevWasBlock) {
          if (currentOffset >= targetOffset) {
            // ブロック要素の直前にカーソルを配置
            if (lastTextNode) {
              return {
                node: lastTextNode,
                offset: lastTextNode.textContent?.length || 0,
              };
            }
          }
          currentOffset += 1;
        }
        prevWasBlock = true;
      }
    }

    node = walker.nextNode();
  }

  // 正確な位置が見つからない場合
  if (lastTextNode) {
    return {
      node: lastTextNode,
      offset: lastTextNode.textContent?.length || 0,
    };
  }

  // テキストノードが存在しない場合、要素自体を返す
  return {
    node: element,
    offset: 0,
  };
};
