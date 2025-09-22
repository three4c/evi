import {
  COMMON_KEYMAPS,
  INSERT_KEYMAPS,
  NORMAL_KEYMAPS,
  VISUAL_KEYMAPS,
} from "@/keymaps";
import type { Keymaps } from "@/utils";
import { loadKeymaps } from "./shortcuts";

let cachedKeymaps: Keymaps | null = null;

export const getKeymaps = async () => {
  if (!cachedKeymaps) {
    const savedKeymaps = await loadKeymaps();
    cachedKeymaps = {
      common: { ...COMMON_KEYMAPS, ...savedKeymaps.common },
      insert: { ...INSERT_KEYMAPS, ...savedKeymaps.insert },
      normal: { ...NORMAL_KEYMAPS, ...savedKeymaps.normal },
      visual: { ...VISUAL_KEYMAPS, ...savedKeymaps.visual },
    };
  }
  return cachedKeymaps;
};
