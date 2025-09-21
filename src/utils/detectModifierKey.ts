export const detectModifierKey = (e: KeyboardEvent) => {
  const keys = [];
  if (e.ctrlKey) keys.push("ctrl");
  if (e.altKey) keys.push("alt");
  keys.push(e.key);
  return keys.join("+");
};
