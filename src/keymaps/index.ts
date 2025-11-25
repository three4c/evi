import {
  COMMON_KEYMAPS,
  INSERT_KEYMAPS,
  NORMAL_KEYMAPS,
  VISUAL_KEYMAPS,
} from "@/keymaps";

export * from "./common";
export * from "./insert";
export * from "./normal";
export * from "./visual";

export const DEFAULT_KEYMAPS: Keymaps = {
  common: COMMON_KEYMAPS,
  insert: INSERT_KEYMAPS,
  normal: NORMAL_KEYMAPS,
  visual: VISUAL_KEYMAPS,
};
