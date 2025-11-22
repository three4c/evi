/**
 * Helper functions to abstract differences between INPUT/TEXTAREA and contenteditable elements
 */

/**
 * Check if an element is contenteditable
 */
export const isContentEditable = (
  element: Element | null,
): element is HTMLElement => {
  return element instanceof HTMLElement && element.isContentEditable;
};

/**
 * Get text content from an element (works with INPUT, TEXTAREA, and contenteditable)
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

  // For contenteditable, convert HTML to plain text
  // Replace <br> and <div> with newlines
  const clone = element.cloneNode(true) as HTMLElement;

  // Replace <br> with newline
  clone.querySelectorAll("br").forEach((br) => {
    br.replaceWith("\n");
  });

  // Replace block elements with newlines
  clone.querySelectorAll("div, p").forEach((block, index) => {
    if (index > 0) {
      block.prepend(document.createTextNode("\n"));
    }
  });

  return clone.textContent || "";
};

/**
 * Get text length from an element
 */
export const getTextLength = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
): number => {
  return getText(element).length;
};

/**
 * Get current selection range from an element
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

  // For contenteditable, calculate offset from window selection
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { start: 0, end: 0 };
  }

  const range = selection.getRangeAt(0);

  // Calculate start and end offsets relative to element's text content
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(element);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = getTextContentLength(preSelectionRange);

  const end = start + getTextContentLength(range);

  return { start, end };
};

/**
 * Set selection range on an element
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

  // For contenteditable, use Range API
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
      // If setting range fails, just place cursor at start
      range.setStart(startNode, startOffset);
      range.setEnd(startNode, startOffset);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

/**
 * Helper: Get text content length from a Range, accounting for line breaks
 */
const getTextContentLength = (range: Range): number => {
  const container = document.createElement("div");
  container.appendChild(range.cloneContents());

  // Count <br> as newlines
  const brCount = container.querySelectorAll("br").length;

  // Count block elements as newlines (except the first one)
  const blockCount = Math.max(
    0,
    container.querySelectorAll("div, p").length - 1,
  );

  return (container.textContent || "").length + brCount + blockCount;
};

/**
 * Helper: Find the text node and offset for a given character position
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
        // Accept text nodes and <br> elements
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT;
        }
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName === "BR"
        ) {
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
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName === "BR"
    ) {
      // <br> counts as 1 character (newline)
      if (currentOffset + 1 >= targetOffset) {
        // Place cursor after the <br>
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

  // If we couldn't find the exact position, return the last text node or element itself
  return {
    node: element.lastChild || element,
    offset: element.lastChild?.textContent?.length || 0,
  };
};
