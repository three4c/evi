import { DEFAULT_KEYMAPS } from "@/keymaps";
import type { Keymaps } from "@/utils";

const STORAGE_KEY = "keymaps";

export const saveKeymaps = async (keymaps: Keymaps): Promise<void> => {
  await chrome.storage.sync.set({ keymaps });
};

export const resetKeymaps = async (): Promise<void> => {
  await chrome.storage.sync.remove(STORAGE_KEY);
};

export const loadKeymaps = async (): Promise<Keymaps> => {
  const result = await chrome.storage.sync.get([STORAGE_KEY]);
  return result.keymaps || DEFAULT_KEYMAPS;
};

export const onKeymapsChanged = (callback: (keymaps: Keymaps) => void) => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.keymaps) {
      callback(changes.keymaps.newValue || DEFAULT_KEYMAPS);
    }
  });
};

export const onKeymapsMessaged = (callback: (keymaps: Keymaps) => void) => {
  chrome.runtime.onMessage.addListener(({ keymaps }) => callback(keymaps));
};

export const openSidePanel = () => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {});
};

export const onKeymapsChangedMessaged = () => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.keymaps) {
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              keymaps: changes.keymaps.newValue,
            });
          }
        }
      });
    }
  });
};
