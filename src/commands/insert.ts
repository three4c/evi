import type { Command } from "@/utils";

export const INSERT_COMMANDS: Record<string, Command> = {
  enter_normal_mode: ({ element, start, end, length, lines, currentLine }) => {
    if (length === 0) return;
    start = element.selectionStart || 0;
    if (
      start === length ||
      (lines[currentLine].length && element.value.charAt(start) === "\n")
    ) {
      start--;
    }
    end = start + 1;
    element.setSelectionRange(start, end);
    return { start, end, mode: "normal" };
  },
};
