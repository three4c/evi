import { useEffect, useState } from "react";
import { Textarea } from "../components/Textarea";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

const App: React.FC = () => {
  const [isShow, setShow] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
  });
  const [size, setSize] = useState({
    width: 0,
    height: 9,
  });
  const [fontSize, setFontSize] = useState(0);

  const getElement = (element: Element | null) =>
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
      ? element
      : null;

  const startVim = (
    element: HTMLInputElement | HTMLTextAreaElement,
    e: KeyboardEvent,
  ) => {
    setShow(!isShow);
    setFontSize(parseInt(window.getComputedStyle(element).fontSize));

    const { top, left, width, height } = element.getBoundingClientRect();
    setPos({
      top,
      left,
    });
    setSize({
      width,
      height,
    });
  };

  console.log(isShow);

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
        startVim(element, e);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isShow]);

  return isShow ? (
    <Textarea
      fontSize={fontSize}
      top={pos.top}
      left={pos.left}
      width={size.width}
      height={size.height}
    />
  ) : null;
};

export default App;
