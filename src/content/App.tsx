import { useCallback, useEffect, useRef, useState } from "react";

import {
  getElement,
  handleKeyDown,
  loadShortcuts,
  matchesShortcut,
  onShortcutsChanged,
  type ShortcutConfig,
  type MODE_TYPE,
} from "../utils";

const App: React.FC = () => {
  const mode = useRef<MODE_TYPE>("insert");
  const pos = useRef({
    start: 0,
    end: 0,
    oStart: 0,
    oEnd: 0,
    oCurrentLine: 0,
  });
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutConfig>>(
    {},
  );

  const keydown = useCallback((e: KeyboardEvent) => {
    handleKeyDown(e, { mode, pos });
  }, []);

  useEffect(() => {
    loadShortcuts().then(setShortcuts);
    onShortcutsChanged(setShortcuts);
  }, []);

  // FIXME: common.ts に寄せる
  useEffect(() => {
    const enterNormalMode = (e: KeyboardEvent) => {
      if (shortcuts.normal_mode && matchesShortcut(e, shortcuts.normal_mode)) {
        const activeElement = document.activeElement;
        const element = getElement(activeElement);
        const DOM_ARRAY = ["INPUT", "TEXTAREA"];
        if (!element || !DOM_ARRAY.includes(element.tagName)) return;
        mode.current = "normal";
        const start = element.selectionStart || 0;
        const end = start + 1;
        pos.current = { ...pos.current, start, end };
        element.setSelectionRange(start, end);
      }
    };
    window.addEventListener("keydown", enterNormalMode);
    return () => window.removeEventListener("keydown", enterNormalMode);
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return null;
};

export default App;
