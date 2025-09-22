import type { Keymaps } from "./types";

export const getMaxKeyHistory = (keymaps: Keymaps) => {
  return Math.max(
    ...[
      ...Object.keys(keymaps.normal),
      ...Object.keys(keymaps.visual),
      ...Object.keys(keymaps.common),
      ...Object.keys(keymaps.insert),
    ].map((command) => command.split(" ").length),
  );
};
