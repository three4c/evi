import { type Command, insertText } from "../utils";

export const COMMON_COMMANDS: Record<string, Command> = {
  i: ({ start }) => ({ start, end: start, mode: "insert" }),
  I: ({ start, end, element }) => {
    start = end = element.value.lastIndexOf("\n", start) + 1;
    return { start, end, mode: "insert" };
  },
  a: ({ end }) => ({ start: end, end, mode: "insert" }),
  A: ({ start, end, element }) => {
    start = end = element.value.indexOf("\n", start);
    return { start, end, mode: "insert" };
  },
  s: ({ start, end, element }) => {
    insertText(element, start, end, "");
    return { start, end: start, mode: "insert" };
  },
  S: ({ start, end, element, length }) => {
    const prevBreak = element.value.lastIndexOf("\n", start) + 1;
    const nextBreak = element.value.indexOf("\n", end);
    start = prevBreak === -1 ? 0 : prevBreak;
    end = nextBreak === -1 ? length : nextBreak;
    insertText(element, start, end, "");
    return { start, end: start, mode: "insert" };
  },
  v: ({ mode, start, end, currentLine, oStart, oEnd }) => {
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
