import { useEffect, useRef, useState } from "react";
import {
  loadShortcuts,
  matchesShortcut,
  onShortcutsChanged,
  ShortcutConfig,
} from "../utils/shortcuts";

type MODE_TYPE = "normal" | "insert" | "visual";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App: React.FC = () => {
  const mode = useRef<MODE_TYPE>("insert");
  const pos = useRef({
    start: 0,
    end: 0,
  });
  const originalPos = useRef<
    | {
        start: number;
        end: number;
        currentLine: number;
      }
    | undefined
  >(undefined);
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutConfig>>(
    {},
  );

  const getElement = (element: Element | null) =>
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
      ? element
      : null;

  const getLines = (
    element: HTMLInputElement | HTMLTextAreaElement,
    start: number,
  ) => {
    let charCount = 0;
    let currentLine = 0;
    let col = 0;
    const lines = element.value.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const linesLength = lines[i].length + 1;

      if (charCount + linesLength > start) {
        currentLine = i;
        col = start - charCount;
        break;
      }

      charCount += linesLength;
    }

    return {
      lines,
      charCount,
      currentLine,
      col,
    };
  };

  const startVim = async (
    element: HTMLInputElement | HTMLTextAreaElement,
    e: KeyboardEvent,
  ) => {
    let { start, end } = pos.current;

    if (mode.current === "normal") {
      start = element.selectionStart || 0;
      end = start + 1;
    }

    const { lines, charCount, currentLine, col } = getLines(element, start);

    if (mode.current === "normal") {
      if (e.key === "h" && col) {
        start--;
        end = start + 1;
      }

      if (e.key === "l" && col !== lines[currentLine].length - 1) {
        start++;
        end = start + 1;
      }

      if (e.key === "j" && currentLine + 1 < lines.length) {
        const nextLineLength = lines[currentLine + 1].length;
        const next = charCount + lines[currentLine].length + 1;

        if (nextLineLength) {
          const overCharCount =
            col >= nextLineLength ? col - nextLineLength + 1 : 0;
          start = next + col - overCharCount;
        } else {
          start = next;
        }
        end = start + 1;
      }

      if (e.key === "k" && currentLine > 0) {
        const prevLineLength = lines[currentLine - 1].length;
        const prev = charCount - (lines[currentLine - 1].length + 1);

        if (prevLineLength) {
          const overCharCount =
            col >= prevLineLength ? col - prevLineLength + 1 : 0;
          start = prev + col - overCharCount;
        } else {
          start = prev;
        }
        end = start + 1;
      }

      if (lines[currentLine].length && col === lines[currentLine].length) {
        start = start - 1;
        end = start + 1;
      }
    }

    if (mode.current === "visual" && originalPos.current) {
      const { start: oStart, end: oEnd } = originalPos.current;

      if (e.key === "h" && start !== 0) {
        if (end - start === 1) {
          if (start <= oStart) {
            start--;
          } else {
            end--;
          }
        } else {
          if (start < oStart) {
            start--;
          } else {
            end--;
          }
        }
      } else if (e.key === "h" && end !== 1) {
        end--;
      }

      if (e.key === "l" && end !== element.value.length) {
        if (end - start === 1) {
          if (end >= oEnd) {
            end++;
          } else {
            start++;
          }
        } else {
          if (end > oEnd) {
            end++;
          } else {
            start++;
          }
        }
      } else if (e.key === "l" && start !== element.value.length - 1) {
        start++;
      }

      // if (e.key === "j" && currentLine + 1 < lines.length) {
      //   if (currentLine === oCurrentLine || currentLine > oCurrentLine) {
      //     end = end + lines[currentLine].length + 1;
      //   } else {
      //     start = start + lines[currentLine].length + 1;
      //   }
      // }
      //
      // if (e.key === "k" && currentLine > 0) {
      //   if (currentLine === oCurrentLine || currentLine < oCurrentLine) {
      //     start = start - lines[currentLine].length - 1;
      //   } else {
      //     end = end - lines[currentLine].length - 1;
      //   }
      // }

      if (e.key === "y") {
        const text = window.getSelection()?.toString();
        if (text) {
          navigator.clipboard.writeText(text);
          mode.current = "normal";
          start = oStart;
          end = oEnd;
        }
      }
    }

    if (e.key === "o" && element.tagName === "TEXTAREA") {
      const nextBreak = element.value.indexOf("\n", start);
      start = nextBreak === -1 ? element.value.length : nextBreak;
      element.value = [
        element.value.slice(0, start),
        element.value.slice(start, element.value.length),
      ].join("\n");
      start = end = start + 1;
      mode.current = "insert";
    }

    if (e.key === "O" && element.tagName === "TEXTAREA") {
      const prevBreak = element.value.lastIndexOf("\n", start - 1);
      start = prevBreak === -1 ? 0 : prevBreak;
      element.value = [
        element.value.slice(0, start),
        element.value.slice(start, element.value.length),
      ].join("\n");
      start = end = start + (start ? 1 : 0);
      mode.current = "insert";
    }

    if (e.key === "p" && mode.current === "normal") {
      const text = await navigator.clipboard.readText();
      if (text) {
        const pos = lines[currentLine].length === 0 ? start : end;
        element.value = [
          element.value.slice(0, pos),
          element.value.slice(pos, element.value.length),
        ].join(text);
        start = start + text.length;
        end = start + 1;
      }
    }

    if (e.key === "P" && mode.current === "normal") {
      const text = await navigator.clipboard.readText();
      if (text) {
        element.value = [
          element.value.slice(0, start),
          element.value.slice(start, element.value.length),
        ].join(text);
        start = start + text.length - 1;
        end = start + 1;
      }
    }

    if (e.key === "i") {
      end = start;
    }

    if (e.key === "a") {
      start = end;
    }

    if (["i", "a"].includes(e.key)) {
      mode.current = "insert";
    }

    if (e.key === "v") {
      if (mode.current === "normal") {
        mode.current = "visual";
        originalPos.current = { start, end, currentLine };
      } else {
        mode.current = "normal";
        start = originalPos.current?.start || start;
        end = originalPos.current?.end || end;
        originalPos.current = undefined;
      }
    }

    pos.current = { start, end };
    element.setSelectionRange(start, end);
  };

  useEffect(() => {
    loadShortcuts().then(setShortcuts);
    onShortcutsChanged(setShortcuts);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const element = getElement(activeElement);

      if (!element) {
        return;
      }

      if (!DOM_ARRAY.includes(element.tagName)) {
        return;
      }

      if (shortcuts.normal_mode && matchesShortcut(e, shortcuts.normal_mode)) {
        mode.current = "normal";
      }

      if (["normal", "visual"].includes(mode.current)) {
        startVim(element, e);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shortcuts]);

  return null;
};

export default App;
