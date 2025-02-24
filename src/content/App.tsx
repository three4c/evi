import { useEffect, useRef } from "react";

type MODE_TYPE = "normal" | "insert" | "visual";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App: React.FC = () => {
  const mode = useRef<MODE_TYPE>("insert");
  const pos = useRef({
    start: 0,
    end: 0,
  });

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
    let { start, end } = pos.current;

    if (mode.current === "normal") {
      start = element.selectionStart || 0;
      end = start + 1;
    }

    const { lines, charCount, currentLine, col } = getLines(element, start);

    if (e.key === "h" && col) {
      if (mode.current === "visual") {
        end--;
      } else {
        start--;
        end = start + 1;
      }
    }

    if (e.key === "l" && col !== lines[currentLine].length - 1) {
      if (mode.current === "visual") {
        end++;
      } else {
        start++;
        end = start + 1;
      }
    }

    console.log(start, end);

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

    pos.current = { start, end };
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
