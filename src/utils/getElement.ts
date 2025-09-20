const getElement = (element: Element | null) =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
    ? element
    : null;

export { getElement };
