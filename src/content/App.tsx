import { useCallback, useEffect, useRef, useState } from "react";

// import { insertText } from "../utils/insertText";
import {
  loadShortcuts,
  matchesShortcut,
  onShortcutsChanged,
  type ShortcutConfig,
} from "../utils/shortcuts";
import { getElement } from "../utils/getElement";
// import { getLines } from "../utils/getLines";
import { handleKeyDown } from "../utils/handleKeydown";

import type { MODE_TYPE } from "../utils/types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App: React.FC = () => {
  const mode = useRef<MODE_TYPE>("insert");
  const pos = useRef({
    start: 0,
    end: 0,
  });
  const originalPos = useRef({ oStart: 0, oEnd: 0, oCurrentLine: 0 });
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutConfig>>(
    {},
  );

  // const startVim = async (
  //   element: HTMLInputElement | HTMLTextAreaElement,
  //   e: KeyboardEvent,
  // ) => {
  //   let { start, end } = pos.current;
  //   const { length } = element.value;
  //
  //   if (mode.current === "normal") {
  //     start = element.selectionStart || 0;
  //     end = start + 1;
  //   }
  //
  //   pos.current = { start, end };
  //   element.setSelectionRange(start, end);
  // };

  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     const activeElement = document.activeElement;
  //     const element = getElement(activeElement);
  //
  //     if (!element) {
  //       return;
  //     }
  //
  //     if (!DOM_ARRAY.includes(element.tagName)) {
  //       return;
  //     }
  //
  //     if (shortcuts.normal_mode && matchesShortcut(e, shortcuts.normal_mode)) {
  //       mode.current = "normal";
  //     }
  //
  //     if (["normal", "visual"].includes(mode.current)) {
  //       startVim(element, e);
  //       e.preventDefault();
  //     }
  //   };
  //
  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [shortcuts]);

  const keydown = useCallback((e: KeyboardEvent) => {
    handleKeyDown(e, { mode, pos, originalPos });
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
        if (!element || !DOM_ARRAY.includes(element.tagName)) return;
        mode.current = "normal";
        const start = element.selectionStart || 0;
        const end = start + 1;
        pos.current = { start, end };
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
