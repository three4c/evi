import type { Keymaps } from "@/utils";

export const getMaxKeyHistory = (keymaps: Keymaps) =>
  Math.max(
    ...[
      ...Object.values(keymaps.normal),
      ...Object.values(keymaps.visual),
      ...Object.values(keymaps.common),
      ...Object.values(keymaps.insert),
    ].map((command) => command.split(" ").length),
  );
