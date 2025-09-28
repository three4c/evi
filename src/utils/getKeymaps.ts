import { DEFAULT_KEYMAPS } from "@/keymaps";
import { type Keymaps, loadKeymaps, onKeymapsChanged } from "@/utils";

let cachedKeymaps: Keymaps | null = null;
let isUpdating = false;

export const markKeymapsUpdating = () => {
  onKeymapsChanged(() => {
    isUpdating = true;
  });
};

export const getKeymaps = async () => {
  if (!cachedKeymaps || isUpdating) {
    const savedKeymaps = await loadKeymaps();
    cachedKeymaps = {
      common: { ...DEFAULT_KEYMAPS.common, ...savedKeymaps.common },
      insert: { ...DEFAULT_KEYMAPS.insert, ...savedKeymaps.insert },
      normal: { ...DEFAULT_KEYMAPS.normal, ...savedKeymaps.normal },
      visual: { ...DEFAULT_KEYMAPS.visual, ...savedKeymaps.visual },
    };
    isUpdating = false;
  }

  return cachedKeymaps;
};
