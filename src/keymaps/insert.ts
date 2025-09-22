const isBrowser = typeof navigator !== "undefined";
const isMac = isBrowser && navigator.platform.toUpperCase().includes("MAC");

export const INSERT_KEYMAPS: Record<string, string> = {
  enter_normal_mode: isMac ? "cmd+E" : "ctrl+E",
};
