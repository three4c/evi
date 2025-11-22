import { type Command, insertText } from "@/utils";
import { getText } from "@/utils/elementHelpers";

export const COMMON_COMMANDS: Record<string, Command> = {
  delete_char_insert: ({ start, end, element }) => {
    insertText(element, start, end, "");
    return { start, end: start, mode: "insert" };
  },
  delete_line_insert: ({ start, end, element, length }) => {
    const text = getText(element);
    const prevBreak = text.lastIndexOf("\n", start) + 1;
    const nextBreak = text.indexOf("\n", end);
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
