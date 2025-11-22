export const getElement = (
  element: Element | null,
): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element;
  }

  // Check if element is contenteditable
  if (element instanceof HTMLElement && element.isContentEditable) {
    return element;
  }

  return null;
};
