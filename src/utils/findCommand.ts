import type { Command } from "./types";

export const findCommand = (
  searchKey: string,
  keymaps: Record<string, string>,
  commands: Record<string, Command>,
) => {
  const commandName =
    Object.keys(keymaps).find((k) => keymaps[k] === searchKey) || "";
  return commands[commandName] ? commandName : null;
};
