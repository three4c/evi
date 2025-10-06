import { type ElementType, getLines, type MODE_TYPE } from "@/utils";

export const initCursorMarker = (element: ElementType) => {
  if (!element || element._markerHost) return;

  const host = document.createElement("div");
  host.style.position = "absolute";
  host.style.top = "0";
  host.style.left = "0";
  host.style.width = "0";
  host.style.height = "0";
  host.style.pointerEvents = "none";
  host.style.zIndex = "9999";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "closed" });

  const marker = document.createElement("div");
  marker.style.position = "absolute";
  // @see: https://developer.mozilla.org/docs/Web/CSS/system-color#highlight
  marker.style.backgroundColor = "Highlight";
  marker.style.display = "none";
  shadow.appendChild(marker);

  element._markerHost = host;
  element._marker = marker;
  element.addEventListener("focusout", () => hideCursorMarker(element));
  let rafId: number;
  element.addEventListener("scroll", () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateCursorMarker(element));
  });
};

let cachedMode = "insert";
export const updateCursorMarker = (element: ElementType, mode?: MODE_TYPE) => {
  if (!element?._marker) return;

  const { value, _marker: marker } = element;
  const isEmpty = value === "";
  const isLastLineEmpty = value.endsWith("\n");

  if (!isEmpty && !isLastLineEmpty) return;

  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const { lines, currentLine } = getLines(element, element.selectionStart || 0);
  const lineCount = lines.length;

  cachedMode = mode || cachedMode;
  const shouldShow =
    cachedMode !== "insert" &&
    ((isEmpty && currentLine === 0) ||
      (isLastLineEmpty && currentLine === lineCount - 1));

  if (!shouldShow) {
    marker.style.display = "none";
    element.style.caretColor = "";
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
      : borderTop + paddingTop + (lineCount - 1) * lineHeight;
  const leftOffset = borderLeft + paddingLeft;

  marker.style.display = "block";
  marker.style.width = `${fontSize * 0.5}px`;
  marker.style.height = `${lineHeight}px`;
  marker.style.top = `${rect.top + window.scrollY + topOffset - element.scrollTop}px`;
  marker.style.left = `${rect.left + window.scrollX + leftOffset}px`;
  element.style.caretColor = "transparent";
};

export const hideCursorMarker = (element: ElementType) => {
  if (!element?._marker) return;
  element._marker.style.display = "none";
  element.style.caretColor = "";
};
