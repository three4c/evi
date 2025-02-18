import { useEffect, useRef } from "react";

type MODE_TYPE = "normal" | "insert" | "visual";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App: React.FC = () => {
  const mode = useRef<MODE_TYPE>("insert");

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

  const startVim = (
    element: HTMLInputElement | HTMLTextAreaElement,
    e: KeyboardEvent,
  ) => {
    let start = element.selectionStart || 0;
    let end = start + 1;

    const { lines, charCount, currentLine, col } = getLines(element, start);

    if (e.key === "h" && start) {
      start--;
      end = start + 1;
    }

    if (e.key === "l" && col !== lines[currentLine].length - 1) {
      start++;
      end = start + 1;
    }

    if (e.key === "j" && currentLine + 1 < lines.length) {
      const overCharCount =
        col >= lines[currentLine + 1].length
          ? col - lines[currentLine + 1].length + 1
          : 0;
      const next = charCount + lines[currentLine].length + 1;
      start = next + col - overCharCount;
      end = start + 1;
    }

    if (e.key === "k" && currentLine > 0) {
      const overCharCount =
        col >= lines[currentLine - 1].length
          ? col - lines[currentLine - 1].length + 1
          : 0;
      const prev = charCount - (lines[currentLine - 1].length + 1);
      start = prev + col - overCharCount;
      end = start + 1;
    }

    if (lines[currentLine].length && col === lines[currentLine].length) {
      start = start - 1;
      end = start + 1;
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
      mode.current = "visual";
    }

    element.setSelectionRange(start, end);
  };

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

      if (e.ctrlKey && e.metaKey && e.key === "e") {
        mode.current = "normal";
      }

      if (["normal", "visual"].includes(mode.current)) {
        startVim(element, e);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
};

export default App;
