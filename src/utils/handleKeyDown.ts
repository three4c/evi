import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines";
import { NORMAL_COMMANDS } from "../commands/normal";
import { VISUAL_COMMANDS } from "../commands/visual";
import { COMMON_COMMANDS } from "../commands/common";
import type { Args, Command, Positions } from "./types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let keyHistory: string[] = [];

// すべてのキーマップから最大キー数を取得
const maxHistory = Math.max(
  ...[
    ...Object.keys(NORMAL_COMMANDS),
    ...Object.keys(VISUAL_COMMANDS),
    ...Object.keys(COMMON_COMMANDS),
  ].map((command) => command.split(" ").length),
);

export const handleKeyDown = async (e: KeyboardEvent, args: Args) => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName)) return;

  const { mode } = args;

  if (!["normal", "visual"].includes(mode.current)) {
    return;
  }

  e.preventDefault();

  let { start, end } = args.pos.current;

  const updatePositions = (newPositions: Partial<Positions> | void = {}) => {
    // 部分的に位置情報が更新された時、不足部分を現在の位置情報で補う
    args.pos.current = { ...args.pos.current, ...newPositions };
    ({ start, end } = args.pos.current);
  };

  const combinedArgs = {
    mode,
    element,
    length: element.value.length,
    endCurrentLine: getLines(element, end).currentLine,
    ...args.pos.current,
    ...getLines(element, start),
  };

  const key = detectModifierKey(e);

  let commands: Record<string, Command> = {};
  if (mode.current === "normal") {
    commands = { ...NORMAL_COMMANDS, ...COMMON_COMMANDS };
  }
  if (mode.current === "visual") {
    commands = { ...VISUAL_COMMANDS, ...COMMON_COMMANDS };
  }

  if (commands[key]) {
    // 1キーで該当のコマンドが見つかったら発火
    updatePositions(await commands[key](combinedArgs));
    keyHistory = [];
  } else {
    // 見つからなければ、追加で入力されたキーとの組み合わせでコマンドを探す
    keyHistory.push(key);

    if (keyHistory.length > maxHistory) {
      keyHistory.shift();
    }

    const keyCombination = keyHistory.join(" ");

    for (const command in commands) {
      if (keyCombination.endsWith(command)) {
        updatePositions(await commands[command](combinedArgs));
        keyHistory = [];
        break;
      }
    }
  }

  element.setSelectionRange(start, end);
};
