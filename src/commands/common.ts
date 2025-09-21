import { type Command, insertText } from "../utils";

export const COMMON_COMMANDS: Record<string, Command> = {
  insert_before: ({ start }) => ({ start, end: start, mode: "insert" }),
  insert_start: ({ start, end, element }) => {
    start = end = element.value.lastIndexOf("\n", start) + 1;
    return { start, end, mode: "insert" };
  },
  insert_after: ({ end }) => ({ start: end, end, mode: "insert" }),
  insert_end: ({ start, end, element }) => {
    start = end = element.value.indexOf("\n", start);
    return { start, end, mode: "insert" };
  },
  delete_char_insert: ({ start, end, element }) => {
    insertText(element, start, end, "");
    return { start, end: start, mode: "insert" };
  },
  delete_line_insert: ({ start, end, element, length }) => {
    const prevBreak = element.value.lastIndexOf("\n", start) + 1;
    const nextBreak = element.value.indexOf("\n", end);
    start = prevBreak === -1 ? 0 : prevBreak;
    end = nextBreak === -1 ? length : nextBreak;
    insertText(element, start, end, "");
    return { start, end: start, mode: "insert" };
  },
  toggle_visual: ({ mode, start, end, currentLine, oStart, oEnd }) => {
    if (mode === "normal") {
      return {
        oStart: start,
        oEnd: end,
        oCurrentLine: currentLine,
        mode: "visual",
      };
    } else {
      return { start: oStart, end: oEnd, mode: "normal" };
    }
  },
};
