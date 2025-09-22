import type { Command } from "../utils";

export const INSERT_COMMANDS: Record<string, Command> = {
  enter_normal_mode: ({ element, start, end }) => {
    start = element.selectionStart || 0;
    end = start + 1;
    element.setSelectionRange(start, end);
    return { start, end, mode: "normal" };
  },
};
