import { openSidePanel } from "@/utils/";

export default defineBackground(() => {
  openSidePanel();

  chrome.runtime.onMessage.addListener((msg) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          keymaps: msg.keymaps,
        });
      }
    });

    return true;
  });
});
