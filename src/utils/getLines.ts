import { getText } from "./elementHelpers";

export const getLines = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  start: number,
) => {
  let charCount = 0;
  let currentLine = 0;
  let col = 0;
  const lines = getText(element).split("\n");

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
