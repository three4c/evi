import { type Command, insertText } from "@/utils";

export const NORMAL_COMMANDS: Record<string, Command> = {
  insert_before: ({ start }) => ({ start, end: start, mode: "insert" }),
  insert_start: ({ start, end, element, lines, currentLine }) => {
    start = end = element.value.lastIndexOf("\n", start) + 1;
    if (!lines[currentLine].length) start = end = end - 1;
    return { start, end, mode: "insert" };
  },
  insert_after: ({ end, lines, currentLine }) => {
    if (!lines[currentLine].length) end--;
    return { start: end, end, mode: "insert" };
  },
  insert_end: ({ start, end, element }) => {
    start = end = element.value.indexOf("\n", start);
    return { start, end, mode: "insert" };
  },
  left: ({ start, end, col }) => {
    if (col) return { start: start - 1, end: end - 1 };
  },
  down: ({ start, col, lines, charCount, currentLine }) => {
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
  up: ({ start, col, lines, charCount, currentLine }) => {
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
  right: ({ start, end, col, lines, currentLine }) => {
    if (col !== (lines[currentLine].length || 1) - 1)
      return { start: start + 1, end: end + 1 };
  },
  join_line: ({ start, end, element }) => {
    const nextBreak = element.value.indexOf("\n", start);
    if (nextBreak >= 0) {
      start = nextBreak;
      end = nextBreak + 1;
      insertText(element, start, end, " ");
      return { start, end };
    }
  },
  delete_left: ({ element, start, end }) => {
    start--;
    end--;
    insertText(element, start, end, "");
    return { start, end };
  },
  // delete_down: ({ element, start, end, lines, currentLine, length }) => {
  //   const isAtLastLine = currentLine === lines.length - 1;
  //   if (isAtLastLine) return { start, end };
  //   const isEmptyLine = lines[currentLine].length === 0;
  //   const prevBreak = element.value.lastIndexOf("\n", start);
  //   const nextBreak = element.value.indexOf("\n", end - (isEmptyLine ? 1 : 0));
  //   const secondNextBreak = element.value.indexOf("\n", nextBreak + 1);
  //   const isAtSecondLastLine = currentLine === lines.length - 2;
  //   start = prevBreak === -1 ? 0 : prevBreak + (isAtSecondLastLine ? 0 : 1);
  //   end = secondNextBreak === -1 ? length : secondNextBreak + 1;
  //   insertText(element, start, end, "");
  //   if (isAtSecondLastLine) start--;
  //   return { start, end: start + 1 };
  // },
  // delete_up: ({ element, start, end, col, lines, currentLine, length }) => {
  //   const isAtFirstLine = currentLine === 0;
  //   if (isAtFirstLine) return { start, end };
  //   const prevBreak = element.value.lastIndexOf("\n", start);
  //   const secondPrevBreak = element.value.lastIndexOf("\n", prevBreak - 1);
  //   const nextBreak = element.value.indexOf("\n", end);
  //   const isAtSecondLine = currentLine === 1;
  //   const isAtLastLine = currentLine === lines.length - 1;
  //   start =
  //     secondPrevBreak === -1 ? 0 : secondPrevBreak + (isAtLastLine ? 0 : 1);
  //   end = nextBreak === -1 ? length : nextBreak + 1;
  //   insertText(element, start, end, "");
  //   if (!isAtSecondLine) start--;
  //   if (element.value.charAt(start) === "\n") start--;
  //   return { start, end: start + 1 };
  // },
  delete_right: ({ element, start, end }) => {
    insertText(element, start, end, "");
    return { start, end };
  },
  delete_line: ({ element, start, end, lines, currentLine, length }) => {
    const isAtLastLine = currentLine === lines.length - 1;
    if (lines[currentLine].length === 0 && element.value[start] === "\n") {
      end = start + 1;
    } else {
      const prevBreak = element.value.lastIndexOf("\n", start);
      const nextBreak = element.value.indexOf("\n", start);
      start = prevBreak + (isAtLastLine ? 0 : 1);
      end = nextBreak === -1 ? length : nextBreak + 1;
    }
    insertText(element, start, end, "");
    if (isAtLastLine) start--;
    return { start, end: start + 1 };
  },
  delete_after: ({ element, start, end, length, col, lines }) => {
    const nextBreak = element.value.indexOf("\n", end);
    if (lines.length > 1 && col === 0) start--;
    end = nextBreak === -1 ? length : nextBreak;
    insertText(element, start, end, "");
    if (start) start--;
    if (element.value.charAt(start) === "\n") start--;
    end = start + 1;
    return { start, end };
  },
  insert_below: ({ start, end, element, length }) => {
    if (element.tagName === "TEXTAREA") {
      const nextBreak = element.value.indexOf("\n", start);
      start = nextBreak === -1 ? length : nextBreak;
      start = end = start + 1;
      insertText(element, start, end, "\n");
      return { start, end, mode: "insert" };
    }
  },
  insert_above: ({ start, end, element }) => {
    if (element.tagName === "TEXTAREA") {
      const prevBreak = element.value.lastIndexOf("\n", start - 1);
      start = prevBreak === -1 ? 0 : prevBreak;
      start = end = start + (start ? 1 : 0);
      insertText(element, start, end, "\n");
      return { start, end, mode: "insert" };
    }
  },
  paste_after: async ({ start, end, element, lines, currentLine }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      const pos = lines[currentLine].length === 0 ? start : end;
      insertText(element, pos, pos, text);
      start = start + text.length;
      end = start + 1;
      return { start, end };
    }
  },
  paste_before: async ({ start, end, element }) => {
    const text = await navigator.clipboard.readText();
    if (text) {
      insertText(element, start, start, text);
      start = start + text.length - 1;
      end = start + 1;
      return { start, end };
    }
  },
  cut_char: ({ start, end, element }) => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
      insertText(element, start, end, "");
      return { start, end };
    }
  },
  cut_char_before: ({ start, end, element }) => {
    start = start - 1;
    end = end - 1;
    navigator.clipboard.writeText(element.value.slice(start, start + 1));
    insertText(element, start, end, "");
    return { start, end };
  },
  undo: () => {
    document.execCommand("undo");
  },
  redo: () => {
    document.execCommand("redo");
  },
};
