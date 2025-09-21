import {
  getElement,
  handleKeyDown,
  loadShortcuts,
  type MODE_TYPE,
  matchesShortcut,
  onShortcutsChanged,
  type Positions,
  type ShortcutConfig,
} from "../utils";

let initComplete = false;
let mode: MODE_TYPE = "insert";
let pos: Positions = { start: 0, end: 0, oStart: 0, oEnd: 0, oCurrentLine: 0 };
let shortcuts: Record<string, ShortcutConfig> = {};

const keydown = async (e: KeyboardEvent) =>
  ({ mode, pos } = await handleKeyDown(e, { mode, pos }));

// FIXME: common.ts に寄せる
const enterNormalMode = (e: KeyboardEvent) => {
  if (shortcuts.normal_mode && matchesShortcut(e, shortcuts.normal_mode)) {
    const activeElement = document.activeElement;
    const element = getElement(activeElement);
    const DOM_ARRAY = ["INPUT", "TEXTAREA"];
    if (!element || !DOM_ARRAY.includes(element.tagName)) return;
    mode = "normal";
    const start = element.selectionStart || 0;
    const end = start + 1;
    pos = { ...pos, start, end };
    element.setSelectionRange(start, end);
  }
};

export const initVim = () => {
  if (initComplete) return;
  loadShortcuts().then((s) => (shortcuts = s));
  onShortcutsChanged((s) => (shortcuts = s));
  window.addEventListener("keydown", enterNormalMode); // FIXME: common.ts に寄せる
  window.addEventListener("keydown", keydown);
  initComplete = true;
};

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    initVim();
  },
});
