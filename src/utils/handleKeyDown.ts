import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines";
import { NORMAL_COMMANDS } from "../commands/normal";
import { VISUAL_COMMANDS } from "../commands/visual";
import { COMMON_COMMANDS } from "../commands/common";
import type { Args, Command } from "./types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let keyHistory: string[] = [];

// すべてのキーマップから最大キーシーケンスを計算
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

  let { start, end, oStart, oEnd, oCurrentLine } = args.pos.current;

  const combinedArgs = {
    element,
    mode: args.mode,
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

  const defaultValues = { start, end, oStart, oEnd, oCurrentLine };

  const updatePositions = (newPosition: any) => {
    const updated = newPosition || defaultValues;
    start = updated.start ?? start;
    end = updated.end ?? end;
    oStart = updated.oStart ?? oStart;
    oEnd = updated.oEnd ?? oEnd;
    oCurrentLine = updated.oCurrentLine ?? oCurrentLine;
  };

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

  args.pos.current = { start, end, oStart, oEnd, oCurrentLine };
  element.setSelectionRange(start, end);
};
