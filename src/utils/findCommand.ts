import type { Command, Keymap } from "@/utils";

export const findCommand = (
  searchKey: string,
  keymaps: Keymap,
  commands: Record<string, Command>,
) => {
  const commandName =
    Object.keys(keymaps).find((k) => keymaps[k] === searchKey) || "";
  return commands[commandName] ? commandName : null;
};
