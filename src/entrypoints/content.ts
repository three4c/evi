import { handleKeyDown, type MODE_TYPE, type Positions } from "@/utils";

let initComplete = false;
let mode: MODE_TYPE = "insert";
let pos: Positions = { start: 0, end: 0, oStart: 0, oEnd: 0, oCurrentLine: 0 };

const enterInsertMode = () => (mode = "insert");
const keydown = async (e: KeyboardEvent) =>
  ({ mode, pos } = await handleKeyDown(e, { mode, pos }));

export const initVim = () => {
  if (initComplete) return;
  window.addEventListener("keydown", keydown);
  document.addEventListener("focusout", enterInsertMode);
  initComplete = true;
};

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    initVim();
  },
});
