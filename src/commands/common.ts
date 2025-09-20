import { insertText } from "../utils/insertText";
import { Command } from "../utils/types";

const COMMON_COMMANDS: Record<string, Command> = {
  i: ({ mode, start }) => {
    mode.current = "insert";
    return { start, end: start };
  },
  I: ({ mode, start, end, element }) => {
    start = end = element.value.lastIndexOf("\n", start) + 1;
    mode.current = "insert";
    return { start, end };
  },
  a: ({ mode, end }) => {
    mode.current = "insert";
    return { start: end, end };
  },
  A: ({ mode, start, end, element }) => {
    start = end = element.value.indexOf("\n", start);
    mode.current = "insert";
    return { start, end };
  },
  s: ({ mode, start, end, element }) => {
    insertText(element, start, end, "");
    end = start;
    mode.current = "insert";
    return { start, end };
  },
  S: ({ mode, start, end, element }) => {
    const prevBreak = element.value.lastIndexOf("\n", start) + 1;
    const nextBreak = element.value.indexOf("\n", end);
    start = prevBreak === -1 ? 0 : prevBreak;
    end = nextBreak === -1 ? length : nextBreak;
    insertText(element, start, end, "");
    end = start;
    mode.current = "insert";
    return { start, end };
  },
  v: ({ mode, start, end, currentLine, oStart, oEnd }) => {
    if (mode.current === "normal") {
      mode.current = "visual";
      return { oStart: start, oEnd: end, oCurrentLine: currentLine };
    } else {
      start = oStart;
      end = oEnd;
      mode.current = "normal";
      return { start, end };
    }
  },
};

export { COMMON_COMMANDS };
