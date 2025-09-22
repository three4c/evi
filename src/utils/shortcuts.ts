export const saveKeymaps = async (keymaps: {
  common: Record<string, string>;
  insert: Record<string, string>;
  normal: Record<string, string>;
  visual: Record<string, string>;
}): Promise<void> => {
  await chrome.storage.sync.set({ keymaps: keymaps });
};

export const resetKeymaps = async (): Promise<void> => {
  await chrome.storage.sync.remove("keymaps");
};

export const loadKeymaps = async (): Promise<{
  common: Record<string, string>;
  insert: Record<string, string>;
  normal: Record<string, string>;
  visual: Record<string, string>;
}> => {
  const result = await chrome.storage.sync.get(["keymaps"]);
  return result.keymaps || { common: {}, insert: {}, normal: {}, visual: {} };
};

export const onKeymapsChanged = (
  callback: (keymaps: {
    common: Record<string, string>;
    insert: Record<string, string>;
    normal: Record<string, string>;
    visual: Record<string, string>;
  }) => void,
) => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.keymaps) {
      callback(
        changes.keymaps.newValue || {
          common: {},
          insert: {},
          normal: {},
          visual: {},
        },
      );
    }
  });
};
