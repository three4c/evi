import type { Keymap } from "@/utils";

const isBrowser = typeof navigator !== "undefined";
const isMac = isBrowser && navigator.platform.toUpperCase().includes("MAC");

export const INSERT_KEYMAPS: Keymap = {
  enter_normal_mode: isMac ? "cmd+E" : "ctrl+E",
};
