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
  //   const { lines, charCount, currentLine, col } = getLines(element, start);
  //   const { currentLine: endCurrentLine } = getLines(element, end);
  //
  //   if (mode.current === "visual" && originalPos.current) {
  //     const {
  //       start: oStart,
  //       end: oEnd,
  //       currentLine: oCurrentLine,
  //     } = originalPos.current;
  //
  //     const isSingleChar = end - start === 1;
  //     const shouldMoveStart = isSingleChar ? start <= oStart : start < oStart;
  //     const shouldMoveEnd = isSingleChar ? end >= oEnd : end > oEnd;
  //     const atLeftEdge = start === 0 && oStart === 0;
  //     const atRightEdge = end === length && oEnd === length;
  //
  //     const currentLineLength = lines[currentLine].length + 1;
  //     const endCurrentLineLength = lines[endCurrentLine].length + 1;
  //     const clampToTextBounds = (value: number) =>
  //       Math.max(0, Math.min(value, length));
  //
  //     if (e.key === "h") {
  //       if (start > 0) {
  //         if (shouldMoveStart) {
  //           start--;
  //         } else {
  //           end--;
  //         }
  //       } else if (atLeftEdge && end !== 1 && !isSingleChar) {
  //         end--;
  //       }
  //     }
  //
  //     if (e.key === "l") {
  //       if (end < length) {
  //         if (shouldMoveEnd) {
  //           end++;
  //         } else {
  //           start++;
  //         }
  //       } else if (atRightEdge && start !== length - 1 && !isSingleChar) {
  //         start++;
  //       }
  //     }
  //
  //     if (e.key === "j") {
  //       const canMoveDown = currentLine + 1 < lines.length;
  //       const expandDown = currentLine >= oCurrentLine;
  //       if (canMoveDown && expandDown) {
  //         end = clampToTextBounds(end + currentLineLength);
  //       } else {
  //         start = start + currentLineLength;
  //         if (start > end) {
  //           start = oStart;
  //           end = length;
  //         }
  //       }
  //     }
  //
  //     if (e.key === "k") {
  //       const canMoveUp = endCurrentLine > 0;
  //       const expandUp = endCurrentLine <= oCurrentLine;
  //       if (canMoveUp && expandUp) {
  //         start = clampToTextBounds(start - endCurrentLineLength);
  //       } else {
  //         end = end - endCurrentLineLength;
  //         if (end < start) {
  //           start = 0;
  //           end = oEnd;
  //         }
  //       }
  //     }
  //
  //     if (e.key === "p" || e.key === "P") {
  //       const text = await navigator.clipboard.readText();
  //       if (text) {
  //         insertText(element, start, end, text);
  //         start = start + text.length - 1;
  //         end = start + 1;
  //         mode.current = "normal";
  //       }
  //     }
  //
  //     if (e.key === "y") {
  //       const text = window.getSelection()?.toString();
  //       if (text) {
  //         navigator.clipboard.writeText(text);
  //         mode.current = "normal";
  //         start = oStart;
  //         end = oEnd;
  //       }
  //     }
  //
  //     if (e.key === "x") {
  //       const text = window.getSelection()?.toString();
  //       if (text) {
  //         navigator.clipboard.writeText(text);
  //         element.setRangeText("");
  //         start = oStart;
  //         end = oEnd;
  //         mode.current = "normal";
  //       }
  //     }
  //   }
  //
  //   if (e.key === "i") {
  //     end = start;
  //   }
  //
  //   if (e.key === "I") {
  //     start = end = element.value.lastIndexOf("\n", start) + 1;
  //   }
  //
  //   if (e.key === "a") {
  //     start = end;
  //   }
  //
  //   if (e.key === "A") {
  //     start = end = element.value.indexOf("\n", start);
  //   }
  //
  //   if (e.key === "s") {
  //     insertText(element, start, end, "");
  //     end = start;
  //   }
  //
  //   if (e.key === "S") {
  //     const prevBreak = element.value.lastIndexOf("\n", start) + 1;
  //     const nextBreak = element.value.indexOf("\n", end);
  //     start = prevBreak === -1 ? 0 : prevBreak;
  //     end = nextBreak === -1 ? length : nextBreak;
  //     insertText(element, start, end, "");
  //     end = start;
  //   }
  //
  //   if (["i", "I", "a", "A", "s", "S"].includes(e.key)) {
  //     mode.current = "insert";
  //   }
  //
  //   if (e.key === "v") {
  //     if (mode.current === "normal") {
  //       mode.current = "visual";
  //       originalPos.current = { start, end, currentLine };
  //     } else {
  //       mode.current = "normal";
  //       start = originalPos.current?.start || start;
  //       end = originalPos.current?.end || end;
  //       originalPos.current = undefined;
  //     }
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
