import { getLines } from "@/utils";

const SCROLL_PADDING_LINES = 2;

/**
 * Scrolls the textarea to ensure the caret is visible within the viewport.
 * Only works for textarea elements (input elements don't support scrolling).
 *
 * @param element - The input or textarea element
 * @param caretPosition - The caret position (start of selection)
 */
export const scrollToCaret = (
  element: HTMLInputElement | HTMLTextAreaElement,
  caretPosition: number,
): void => {
  // Only textarea elements support scrolling
  if (element.tagName !== "TEXTAREA") return;

  const textarea = element as HTMLTextAreaElement;

  // Get line info using existing utility
  const { currentLine } = getLines(element, caretPosition);

  // Calculate line height from computed styles
  const style = window.getComputedStyle(textarea);
  const lineHeight =
    Number.parseFloat(style.lineHeight) ||
    Number.parseFloat(style.fontSize) ||
    16;

  // Calculate positions
  const caretTop = currentLine * lineHeight;
  const scrollTop = textarea.scrollTop;
  const clientHeight = textarea.clientHeight;
  const padding = lineHeight * SCROLL_PADDING_LINES;

  // Scroll up if caret is too close to top edge
  if (caretTop < scrollTop + padding) {
    textarea.scrollTop = Math.max(0, caretTop - padding);
  }
  // Scroll down if caret is too close to bottom edge
  else if (caretTop + lineHeight > scrollTop + clientHeight - padding) {
    textarea.scrollTop = caretTop + lineHeight - clientHeight + padding;
  }
};
