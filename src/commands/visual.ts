import { type Command, insertText } from "@/utils";
import { getSelectionRange, getText } from "@/utils/elementHelpers";

export const VISUAL_COMMANDS: Record<string, Command> = {
  expand_left: ({ start, end, oStart }) => {
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
  expand_down: ({
    start,
    end,
    oStart,
    currentLine,
    oCurrentLine,
    lines,
    length,
  }) => {
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
  expand_up: ({
    start,
    end,
    oEnd,
    oCurrentLine,
    endCurrentLine,
    lines,
    length,
  }) => {
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
  expand_right: ({ start, end, oEnd, length }) => {
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
  delete: ({ element, start, end, length }) => {
    const text = getText(element);
    if (text.charAt(start - 1) === "\n" && end === length) start--;
    insertText(element, start, end, "");
    if (end === length) start--;
    end = start + 1;
    return { start, end, mode: "normal" };
  },
  replace: async ({ start, end, element }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      insertText(element, start, end, text);
      start = start + text.length - 1;
      end = start + 1;
      return { start, end, mode: "normal" };
    }
  },
  copy: ({ oStart, oEnd }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      return { start: oStart, end: oEnd, mode: "normal" };
    }
  },
  cut: ({ oStart, oEnd, element }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      // 現在の選択範囲を取得してテキストを削除
      const { start, end } = getSelectionRange(element);
      insertText(element, start, end, "");
      return { start: oStart, end: oEnd, mode: "normal" };
    }
  },
};
