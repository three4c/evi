import { type ElementType, getLines, type MODE_TYPE } from "@/utils";

export const initDummyCaret = (element: ElementType) => {
  if (!element || element._dummyCaretHost) return;
  const ID = "__evi_dummy_caret__";

  let host = document.querySelector<HTMLDivElement>(`#${ID}`);
  let shadow: ShadowRoot | null;
  if (!host) {
    host = document.createElement("div");
    host.id = ID;
    host.style.position = "absolute";
    host.style.top = "0";
    host.style.left = "0";
    host.style.width = "0";
    host.style.height = "0";
    host.style.pointerEvents = "none";
    host.style.zIndex = "9999";
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
  } else {
    shadow = host.shadowRoot;
  }

  const caret = document.createElement("div");
  caret.style.position = "absolute";
  // @see: https://developer.mozilla.org/docs/Web/CSS/system-color#highlight
  caret.style.backgroundColor = "Highlight";
  caret.style.display = "none";
  shadow?.appendChild(caret);

  element._dummyCaretHost = host;
  element._dummyCaret = caret;
  element.addEventListener("focusout", () => hideDummyCaret(element));
  let rafId: number;
  element.addEventListener("scroll", () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateDummyCaret(element));
  });
};

let cachedMode = "insert";
export const updateDummyCaret = (element: ElementType, mode?: MODE_TYPE) => {
  if (!element?._dummyCaret) return;

  const { value, _dummyCaret: caret } = element;
  const isEmpty = value === "";
  const isLastLineEmpty = value.endsWith("\n");

  if (!isEmpty && !isLastLineEmpty) {
    hideDummyCaret(element);
    return;
  }

  cachedMode = mode || cachedMode;

  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const { lines, currentLine } = getLines(element, element.selectionStart || 0);

  const finalLineIndex = lines.length - 1;
  const isAtFirstEmptyLine = isEmpty && currentLine === 0;
  const isAtLastEmptyLine = isLastLineEmpty && currentLine === finalLineIndex;

  if (!(cachedMode !== "insert" && (isAtFirstEmptyLine || isAtLastEmptyLine))) {
    hideDummyCaret(element);
    return;
  }

  const borderTop = parseFloat(style.borderTopWidth);
  const borderLeft = parseFloat(style.borderLeftWidth);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingLeft = parseFloat(style.paddingLeft);
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize);
  const fontSize = parseFloat(style.fontSize);

  const topOffset =
    currentLine === 0
      ? borderTop + paddingTop
      : borderTop + paddingTop + finalLineIndex * lineHeight;
  const leftOffset = borderLeft + paddingLeft;

  const top = rect.top + window.scrollY + topOffset - element.scrollTop;
  caret.style.display = "block";
  caret.style.width = `${fontSize * 0.5}px`;
  caret.style.height = `${lineHeight}px`;
  caret.style.top = `${top}px`;
  caret.style.left = `${rect.left + window.scrollX + leftOffset}px`;
  element.style.caretColor = "transparent";

  if (rect.bottom < top + lineHeight) {
    hideDummyCaret(element);
  }
};

export const hideDummyCaret = (element: ElementType) => {
  if (!element?._dummyCaret) return;
  element._dummyCaret.style.display = "none";
  element.style.caretColor = "";
};
