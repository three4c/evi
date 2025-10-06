import type { Command } from "@/utils";

export const INSERT_COMMANDS: Record<string, Command> = {
  enter_normal_mode: ({ element, start, end, length }) => {
    start = element.selectionStart || 0;
    if (
      (start > 0 && element.value[start] === "\n") ||
      (start === length && !element.value.endsWith("\n"))
    ) {
      start--;
    }
    end = start + 1;
    element.setSelectionRange(start, end);
    return { start, end, mode: "normal" };
  },
};
