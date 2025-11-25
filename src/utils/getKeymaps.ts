import { DEFAULT_KEYMAPS } from "@/keymaps";
import { loadKeymaps } from "@/utils";

export const getKeymaps = async () => {
  const savedKeymaps = await loadKeymaps();
  const cachedKeymaps = {
    common: { ...DEFAULT_KEYMAPS.common, ...savedKeymaps.common },
    insert: { ...DEFAULT_KEYMAPS.insert, ...savedKeymaps.insert },
    normal: { ...DEFAULT_KEYMAPS.normal, ...savedKeymaps.normal },
    visual: { ...DEFAULT_KEYMAPS.visual, ...savedKeymaps.visual },
  };

  return cachedKeymaps;
};
