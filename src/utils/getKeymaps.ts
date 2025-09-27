import { DEFAULT_KEYMAPS } from "@/keymaps";
import { loadKeymaps } from "@/utils";

let cachedKeymaps: Keymaps | null = null;

export const getKeymaps = async () => {
  if (!cachedKeymaps) {
    const savedKeymaps = await loadKeymaps();
    cachedKeymaps = {
      common: { ...DEFAULT_KEYMAPS.common, ...savedKeymaps.common },
      insert: { ...DEFAULT_KEYMAPS.insert, ...savedKeymaps.insert },
      normal: { ...DEFAULT_KEYMAPS.normal, ...savedKeymaps.normal },
      visual: { ...DEFAULT_KEYMAPS.visual, ...savedKeymaps.visual },
    };
  }
  return cachedKeymaps;
};
