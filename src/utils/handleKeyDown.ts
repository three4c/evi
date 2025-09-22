import { COMMON_COMMANDS } from "../commands/common";
import { NORMAL_COMMANDS } from "../commands/normal";
import { VISUAL_COMMANDS } from "../commands/visual";
import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines";
import type { Args, Command } from "./types";

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

export const handleKeyDown = async (
  e: KeyboardEvent,
  args: Args,
): Promise<Args> => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName))
    return { mode: args.mode, pos: args.pos };

  const { mode } = args;

  if (!["normal", "visual"].includes(mode)) {
    return args;
  }

  e.preventDefault();

  let newValues: ReturnType<Command> = {};
  const combinedArgs = {
    mode,
    element,
    length: element.value.length,
    endCurrentLine: getLines(element, args.pos.end).currentLine,
    ...args.pos,
    ...getLines(element, args.pos.start),
  };
  const key = detectModifierKey(e);

  let commands: Record<string, Command> = {};
  if (mode === "normal") {
    commands = { ...NORMAL_COMMANDS, ...COMMON_COMMANDS };
  }
  if (mode === "visual") {
    commands = { ...VISUAL_COMMANDS, ...COMMON_COMMANDS };
  }

  if (commands[key]) {
    // 1キーで該当のコマンドが見つかったら発火
    newValues = await commands[key](combinedArgs);
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
        newValues = await commands[command](combinedArgs);
        keyHistory = [];
        break;
      }
    }
  }

  element.setSelectionRange(
    newValues?.start ?? args.pos.start,
    newValues?.end ?? args.pos.end,
  );

  const { mode: newMode, ...newPos } = newValues || {};
  return {
    pos: { ...args.pos, ...newPos },
    mode: newMode ?? mode,
  };
};
