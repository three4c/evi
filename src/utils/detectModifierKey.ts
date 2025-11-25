export const detectModifierKey = (e: KeyboardEvent) => {
  const keys = [];
  const isCapitalWithCmd =
    e.metaKey && e.shiftKey && e.key.length === 1 && e.key.match(/[a-z]/);
  if (e.ctrlKey) keys.push("ctrl");
  if (e.altKey) keys.push("alt");
  if (e.metaKey) keys.push("cmd");

  // モディファイアキーのみの場合は何も返却しない
  const modifierKeys = ["Control", "Alt", "Meta", "Shift"];
  if (modifierKeys.includes(e.key)) {
    return "";
  }

  // Macの仕様でCommandキーとShiftキーを同時押しすると、e.keyが小文字なるため、大文字に変換する
  keys.push(isCapitalWithCmd ? e.key.toUpperCase() : e.key);
  return keys.join("+");
};
