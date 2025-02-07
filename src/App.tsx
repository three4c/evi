import { useEffect } from "react";
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
  const getFontSize = (element: Element) =>
    window.getComputedStyle(element).fontSize;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        const activeElement = document.activeElement;
        if (activeElement && DOM_ARRAY.includes(activeElement.tagName)) {
          const fontSize = getFontSize(activeElement);
          console.log(activeElement.tagName, fontSize);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div {...stylex.props(styles.div)}>🦐</div>
      {/* <input type="text" /> */}
      {/* <textarea /> */}
    </>
  );
};

export default App;
