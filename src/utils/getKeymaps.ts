import { COMMON_KEYMAPS } from "@/keymaps/common";
import { INSERT_KEYMAPS } from "@/keymaps/insert";
import { NORMAL_KEYMAPS } from "@/keymaps/normal";
import { VISUAL_KEYMAPS } from "@/keymaps/visual";
import { loadKeymaps } from "./shortcuts";
import type { Keymaps } from "./types";

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
