import { type Command, insertText } from "../utils";

export const NORMAL_COMMANDS: Record<string, Command> = {
  h: ({ start, end, col }) => {
    if (col) return { start: start - 1, end: end - 1 };
  },
  j: ({ start, col, lines, charCount, currentLine }) => {
    if (currentLine + 1 < lines.length) {
      const nextLineLength = lines[currentLine + 1].length;
      const next = charCount + lines[currentLine].length + 1;

      if (nextLineLength) {
        const overCharCount =
          col >= nextLineLength ? col - nextLineLength + 1 : 0;
        start = next + col - overCharCount;
      } else {
        start = next;
      }
      return { start, end: start + 1 };
    }
  },
  k: ({ start, col, lines, charCount, currentLine }) => {
    if (currentLine > 0) {
      const prevLineLength = lines[currentLine - 1].length;
      const prev = charCount - (lines[currentLine - 1].length + 1);

      if (prevLineLength) {
        const overCharCount =
          col >= prevLineLength ? col - prevLineLength + 1 : 0;
        start = prev + col - overCharCount;
      } else {
        start = prev;
      }
      return { start, end: start + 1 };
    }
  },
  l: ({ start, end, col, lines, currentLine }) => {
    if (col !== lines[currentLine].length - 1)
      return { start: start + 1, end: end + 1 };
  },
  J: ({ start, end, element }) => {
    const nextBreak = element.value.indexOf("\n", start);
    if (nextBreak >= 0) {
      start = nextBreak;
      end = nextBreak + 1;
      insertText(element, start, end, " ");
      return { start, end };
    }
  },
  "d d": () => {},
  o: ({ start, end, element, length }) => {
    if (element.tagName === "TEXTAREA") {
      const nextBreak = element.value.indexOf("\n", start);
      start = nextBreak === -1 ? length : nextBreak;
      start = end = start + 1;
      insertText(element, start, end, "\n");
      return { start, end, mode: "insert" };
    }
  },
  O: ({ start, end, element }) => {
    if (element.tagName === "TEXTAREA") {
      const prevBreak = element.value.lastIndexOf("\n", start - 1);
      start = prevBreak === -1 ? 0 : prevBreak;
      start = end = start + (start ? 1 : 0);
      insertText(element, start, end, "\n");
      return { start, end, mode: "insert" };
    }
  },
  p: async ({ start, end, element, lines, currentLine }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      const pos = lines[currentLine].length === 0 ? start : end;
      insertText(element, pos, pos, text);
      start = start + text.length;
      end = start + 1;
      return { start, end };
    }
  },
  P: async ({ start, end, element }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      insertText(element, start, start, text);
      start = start + text.length - 1;
      end = start + 1;
      return { start, end };
    }
  },
  x: ({ start, end, element }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      insertText(element, start, end, "");
      return { start, end };
    }
  },
  X: ({ start, end, element }) => {
    start = start - 1;
    end = end - 1;
    navigator.clipboard.writeText(element.value.slice(start, start + 1));
    insertText(element, start, end, "");
    return { start, end };
  },
  u: () => {
    document.execCommand("undo");
  },
  "ctrl+r": () => {
    document.execCommand("redo");
  },
};
