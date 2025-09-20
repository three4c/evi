export const detectModifierKey = (e: KeyboardEvent) => {
  let keys = [];
  if (e.ctrlKey) keys.push("ctrl");
  if (e.altKey) keys.push("alt");
  keys.push(e.key);
  return keys.join("+");
};
