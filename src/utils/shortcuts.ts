import { DEFAULT_KEYMAPS } from "@/keymaps";
import type { Badge, Keymaps, ModeType } from "@/utils";

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

export const saveBadge = (args: Badge, tabId: number) => {
  const modeMap: Record<
    ModeType,
    { text?: "NOR" | "VIS"; color?: [number, number, number, number] }
  > = {
    insert: {},
    normal: { text: "NOR", color: [100, 149, 237, 255] },
    visual: { text: "VIS", color: [255, 140, 0, 255] },
  };

  const { text, color } = modeMap[args.text];
  chrome.action.setBadgeText({ text, tabId });
  if (color) {
    chrome.action.setBadgeBackgroundColor({ color, tabId });
  }
};

export const sendMessage = <T>(args: T) => {
  chrome.runtime.sendMessage({ args });
};

export const onMessage = <T>(callback: (args: T, tabId: number) => void) => {
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (sender.tab?.id) {
      callback(message.args, sender.tab.id);
    }
  });
};

export const onUpdate = (callback: (tabId: number) => void) => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      callback(tabId);
    }
  });
};
