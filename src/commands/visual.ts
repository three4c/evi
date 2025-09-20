import { insertText } from "../utils/insertText";
import { Command } from "../utils/types";

const VISUAL_COMMANDS: Record<string, Command> = {
  h: ({ start, end, oStart }) => {
    const isSingleChar = end - start === 1;
    const shouldMoveStart = isSingleChar ? start <= oStart : start < oStart;
    const atLeftEdge = start === 0 && oStart === 0;
    if (start > 0) {
      if (shouldMoveStart) {
        start--;
      } else {
        end--;
      }
    } else if (atLeftEdge && end !== 1 && !isSingleChar) {
      end--;
    }
    return { start, end };
  },
  j: ({ start, end, oStart, currentLine, oCurrentLine, lines, length }) => {
    const clampToTextBounds = (value: number) =>
      Math.max(0, Math.min(value, length));
    const currentLineLength = lines[currentLine].length + 1;
    const canMoveDown = currentLine + 1 < lines.length;
    const expandDown = currentLine >= oCurrentLine;
    if (canMoveDown && expandDown) {
      end = clampToTextBounds(end + currentLineLength);
    } else {
      start = start + currentLineLength;
      if (start > end) {
        start = oStart;
        end = length;
      }
    }
    return { start, end };
  },
  k: ({ start, end, oEnd, oCurrentLine, endCurrentLine, lines, length }) => {
    const clampToTextBounds = (value: number) =>
      Math.max(0, Math.min(value, length));
    const endCurrentLineLength = lines[endCurrentLine].length + 1;
    const canMoveUp = endCurrentLine > 0;
    const expandUp = endCurrentLine <= oCurrentLine;
    if (canMoveUp && expandUp) {
      start = clampToTextBounds(start - endCurrentLineLength);
    } else {
      end = end - endCurrentLineLength;
      if (end < start) {
        start = 0;
        end = oEnd;
      }
    }
    return { start, end };
  },
  l: ({ start, end, oEnd, length }) => {
    const isSingleChar = end - start === 1;
    const shouldMoveEnd = isSingleChar ? end >= oEnd : end > oEnd;
    const atRightEdge = end === length && oEnd === length;
    if (end < length) {
      if (shouldMoveEnd) {
        end++;
      } else {
        start++;
      }
    } else if (atRightEdge && start !== length - 1 && !isSingleChar) {
      start++;
    }
    return { start, end };
  },
  p: async ({ mode, start, end, element }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      insertText(element, start, end, text);
      start = start + text.length - 1;
      end = start + 1;
      mode.current = "normal";
      return { start, end };
    }
  },
  // FIXME: 外部関数化して、pとPを共通にする
  P: async ({ mode, start, end, element }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      insertText(element, start, end, text);
      start = start + text.length - 1;
      end = start + 1;
      mode.current = "normal";
      return { start, end };
    }
  },
  y: ({ mode, start, end, oStart, oEnd }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      start = oStart;
      end = oEnd;
      mode.current = "normal";
      return { start, end };
    }
  },
  x: ({ mode, start, end, oStart, oEnd, element }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      element.setRangeText("");
      start = oStart;
      end = oEnd;
      mode.current = "normal";
      return { start, end };
    }
  },
};

export { VISUAL_COMMANDS };
