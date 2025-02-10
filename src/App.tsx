import { useEffect, useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import "./reset.css";

const styles = stylex.create({
  div: {
    backdropFilter: "blur()12px",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    fontSize: "2em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
  },
});

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App = () => {
  const isStartVim = useRef(false);

  const startVim = (element: Element, e: KeyboardEvent) => {
    if (
      (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement) &&
      element.selectionStart !== null
    ) {
      let start = element.selectionStart;
      let end = start + 1;

      if (e.key === "h" && start) {
        start--;
        end = start + 1;
      }

      if (e.key === "l" && start !== element.value.length - 1) {
        start++;
        end = start + 1;
      }

      let charCount = 0;
      let currentLine = 0;
      let col = 0;
      const lines = element.value.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1;
        if (charCount + lineLength > start) {
          currentLine = i;
          col = start - charCount;
          break;
        }
        charCount += lineLength;
      }

      if (e.key === "j" && currentLine + 1 < lines.length) {
        const next = charCount + lines[currentLine].length + 1;
        start = next + col;
        end = start + 1;
      }

      if (e.key === "k" && currentLine > 0) {
        const prev = charCount - (lines[currentLine - 1].length + 1);
        start = prev + col;
        end = start + 1;
      }

      element.setSelectionRange(start, end);

      if (e.key === "i") {
        element.setSelectionRange(start, start);
        isStartVim.current = false;
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (!activeElement || !DOM_ARRAY.includes(activeElement.tagName)) {
        return;
      }

      if (e.ctrlKey && e.key === "Enter") {
        isStartVim.current = true;
      }

      if (e.ctrlKey && e.key === "q") {
        isStartVim.current = false;
      }

      if (isStartVim.current) {
        startVim(activeElement, e);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div {...stylex.props(styles.div)}>🦐</div>
      <input type="text" />
      <textarea />
    </>
  );
};

export default App;
