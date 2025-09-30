import {
  getKeymaps,
  handleKeyDown,
  type MODE_TYPE,
  onKeymapsMessaged,
  type Positions,
  saveKeymaps,
} from "@/utils";

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    let mode: MODE_TYPE = "insert";
    let pos: Positions = {
      start: 0,
      end: 0,
      oStart: 0,
      oEnd: 0,
      oCurrentLine: 0,
    };
    let keymaps = await getKeymaps();
    onKeymapsMessaged(async (updateKeymaps) => {
      await saveKeymaps(updateKeymaps);
      keymaps = await getKeymaps();
    });

    const keydown = async (e: KeyboardEvent) =>
      ({ mode, pos } = await handleKeyDown(e, { mode, pos }, keymaps));
    const resetMode = () => (mode = "insert");
    window.addEventListener("keydown", keydown);
    window.addEventListener("focusout", resetMode);
  },
});
