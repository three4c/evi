import { insertText } from "../utils/insertText";
import {
  loadShortcuts,
  matchesShortcut,
  onShortcutsChanged,
  type ShortcutConfig,
} from "../utils/shortcuts";

type MODE_TYPE = "normal" | "insert" | "visual";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let initComplete = false;
let mode: MODE_TYPE = "insert";
let pos = { start: 0, end: 0 };
let originalPos:
  | { start: number; end: number; currentLine: number }
  | undefined;

let shortcuts: Record<string, ShortcutConfig> = {};

const getElement = (element: Element | null) =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
    ? element
    : null;

const getLines = (
  element: HTMLInputElement | HTMLTextAreaElement,
  start: number,
) => {
  let charCount = 0;
  let currentLine = 0;
  let col = 0;
  const lines = element.value.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const linesLength = lines[i].length + 1;
    if (charCount + linesLength > start) {
      currentLine = i;
      col = start - charCount;
      break;
    }
    charCount += linesLength;
  }

  return { lines, charCount, currentLine, col };
};

const startVim = async (
  element: HTMLInputElement | HTMLTextAreaElement,
  e: KeyboardEvent,
) => {
  let { start, end } = pos;
  const { length } = element.value;

  if (mode === "normal") {
    start = element.selectionStart || 0;
    end = start + 1;
  }

  const { lines, charCount, currentLine, col } = getLines(element, start);
  const { currentLine: endCurrentLine } = getLines(element, end);

  if (mode === "normal" && !matchesShortcut(e, shortcuts.normal_mode)) {
    if (e.key === "h" && col) {
      start--;
      end = start + 1;
    }

    if (e.key === "l" && col !== lines[currentLine].length - 1) {
      start++;
      end = start + 1;
    }

    if (e.key === "j" && currentLine + 1 < lines.length) {
      const nextLineLength = lines[currentLine + 1].length;
      const next = charCount + lines[currentLine].length + 1;

      if (nextLineLength) {
        const overCharCount =
          col >= nextLineLength ? col - nextLineLength + 1 : 0;
        start = next + col - overCharCount;
      } else {
        start = next;
      }
      end = start + 1;
    }

    if (e.key === "k" && currentLine > 0) {
      const prevLineLength = lines[currentLine - 1].length;
      const prev = charCount - (lines[currentLine - 1].length + 1);

      if (prevLineLength) {
        const overCharCount =
          col >= prevLineLength ? col - prevLineLength + 1 : 0;
        start = prev + col - overCharCount;
      } else {
        start = prev;
      }
      end = start + 1;
    }

    if (e.key === "J") {
      const nextBreak = element.value.indexOf("\n", start);
      if (nextBreak >= 0) {
        start = nextBreak;
        end = nextBreak + 1;
        insertText(element, start, end, " ");
      }
    }

    if (e.key === "o" && element.tagName === "TEXTAREA") {
      const nextBreak = element.value.indexOf("\n", start);
      start = nextBreak === -1 ? length : nextBreak;
      start = end = start + 1;
      insertText(element, start, end, "\n");
      mode = "insert";
    }

    if (e.key === "O" && element.tagName === "TEXTAREA") {
      const prevBreak = element.value.lastIndexOf("\n", start - 1);
      start = prevBreak === -1 ? 0 : prevBreak;
      start = end = start + (start ? 1 : 0);
      insertText(element, start, end, "\n");
      mode = "insert";
    }

    if (e.key === "p") {
      const text = await navigator.clipboard.readText();
      if (text) {
        const pos = lines[currentLine].length === 0 ? start : end;
        insertText(element, pos, pos, text);
        start = start + text.length;
        end = start + 1;
      }
    }

    if (e.key === "P") {
      const text = await navigator.clipboard.readText();
      if (text) {
        insertText(element, start, start, text);
        start = start + text.length - 1;
        end = start + 1;
      }
    }

    if (e.key === "x") {
      const text = window.getSelection()?.toString();
      if (text) {
        navigator.clipboard.writeText(text);
        insertText(element, start, end, "");
      }
    }

    if (e.key === "X") {
      start = start - 1;
      end = end - 1;
      navigator.clipboard.writeText(element.value.slice(start, start + 1));
      insertText(element, start, end, "");
    }

    if (lines[currentLine].length && col === lines[currentLine].length) {
      start = start - 1;
      end = start + 1;
    }

    if (e.key === "u") {
      // TODO: 将来のブラウザで非推奨になる可能性あり
      document.execCommand("undo");
    }

    if (e.key === "r" && e.ctrlKey) {
      // TODO: 将来のブラウザで非推奨になる可能性あり
      document.execCommand("redo");
    }
  }

  if (mode === "visual" && originalPos) {
    const { start: oStart, end: oEnd, currentLine: oCurrentLine } = originalPos;

    const isSingleChar = end - start === 1;
    const shouldMoveStart = isSingleChar ? start <= oStart : start < oStart;
    const shouldMoveEnd = isSingleChar ? end >= oEnd : end > oEnd;
    const atLeftEdge = start === 0 && oStart === 0;
    const atRightEdge = end === length && oEnd === length;

    const currentLineLength = lines[currentLine].length + 1;
    const endCurrentLineLength = lines[endCurrentLine].length + 1;
    const clampToTextBounds = (value: number) =>
      Math.max(0, Math.min(value, length));

    if (e.key === "h") {
      if (start > 0) {
        if (shouldMoveStart) {
          start--;
        } else {
          end--;
        }
      } else if (atLeftEdge && end !== 1 && !isSingleChar) {
        end--;
      }
    }

    if (e.key === "l") {
      if (end < length) {
        if (shouldMoveEnd) {
          end++;
        } else {
          start++;
        }
      } else if (atRightEdge && start !== length - 1 && !isSingleChar) {
        start++;
      }
    }

    if (e.key === "j") {
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
    }

    if (e.key === "k") {
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
    }

    if (e.key === "p" || e.key === "P") {
      const text = await navigator.clipboard.readText();
      if (text) {
        insertText(element, start, end, text);
        start = start + text.length - 1;
        end = start + 1;
        mode = "normal";
      }
    }

    if (e.key === "y") {
      const text = window.getSelection()?.toString();
      if (text) {
        navigator.clipboard.writeText(text);
        mode = "normal";
        start = oStart;
        end = oEnd;
      }
    }

    if (e.key === "x") {
      const text = window.getSelection()?.toString();
      if (text) {
        navigator.clipboard.writeText(text);
        element.setRangeText("");
        start = oStart;
        end = oEnd;
        mode = "normal";
      }
    }
  }

  if (e.key === "i") {
    end = start;
  }

  if (e.key === "I") {
    start = end = element.value.lastIndexOf("\n", start) + 1;
  }

  if (e.key === "a") {
    start = end;
  }

  if (e.key === "A") {
    start = end = element.value.indexOf("\n", start);
  }

  if (e.key === "s") {
    insertText(element, start, end, "");
    end = start;
  }

  if (e.key === "S") {
    const prevBreak = element.value.lastIndexOf("\n", start) + 1;
    const nextBreak = element.value.indexOf("\n", end);
    start = prevBreak === -1 ? 0 : prevBreak;
    end = nextBreak === -1 ? length : nextBreak;
    insertText(element, start, end, "");
    end = start;
  }

  if (["i", "I", "a", "A", "s", "S"].includes(e.key)) {
    mode = "insert";
  }

  if (e.key === "v") {
    if (mode === "normal") {
      mode = "visual";
      originalPos = { start, end, currentLine };
    } else {
      mode = "normal";
      start = originalPos?.start || start;
      end = originalPos?.end || end;
      originalPos = undefined;
    }
  }

  pos = { start, end };
  element.setSelectionRange(start, end);
};

export const initVim = () => {
  if (initComplete) return;
  loadShortcuts().then((s) => (shortcuts = s));
  onShortcutsChanged((s) => (shortcuts = s));

  const onKeyDown = (e: KeyboardEvent) => {
    const activeElement = document.activeElement;
    const element = getElement(activeElement);

    if (!element) return;
    if (!DOM_ARRAY.includes(element.tagName)) return;

    if (shortcuts.normal_mode && matchesShortcut(e, shortcuts.normal_mode)) {
      mode = "normal";
    }

    if (mode === "normal" || mode === "visual") {
      startVim(element, e);
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  initComplete = true;
};

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    initVim();
  },
});
