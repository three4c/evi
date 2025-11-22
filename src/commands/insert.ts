import type { Command } from "@/utils";
import {
  getSelectionRange,
  getText,
  setSelectionRange,
} from "@/utils/elementHelpers";

export const INSERT_COMMANDS: Record<string, Command> = {
  enter_normal_mode: ({ element, start, end, length, lines, currentLine }) => {
    start = getSelectionRange(element).start || 0;
    if (
      start === length ||
      (lines[currentLine].length && getText(element).charAt(start) === "\n")
    ) {
      start--;
    }
    end = start + 1;
    setSelectionRange(element, start, end);
    return { start, end, mode: "normal" };
  },
};
