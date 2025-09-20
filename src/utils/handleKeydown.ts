import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines.ts";
import { NORMAL_COMMANDS } from "../commands/normal.ts";
import { VISUAL_COMMANDS } from "../commands/visual.ts";
import { COMMON_COMMANDS } from "../commands/common.ts";
import type { Args, CombinedArgs } from "../utils/types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let keyHistory: string[] = [];
const maxHistory = Math.max(
  ...[
    ...Object.keys(NORMAL_COMMANDS),
    ...Object.keys(VISUAL_COMMANDS),
    ...Object.keys(COMMON_COMMANDS),
  ].map((command) => command.split(" ").length),
);

const handleKeyDown = (e: KeyboardEvent, args: Args) => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName)) return;

  const { mode } = args;
  console.log(args);

  if (!["normal", "visual"].includes(mode.current)) {
    return;
  }

  let { start, end } = args.pos.current;
  const { currentLine: endCurrentLine } = getLines(element, end);
  const { lines, charCount, currentLine, col } = getLines(element, start);
  const combinedArgs = {
    start,
    end,
    lines,
    charCount,
    currentLine,
    endCurrentLine,
    col,
    element,
    ...args,
  };
  console.log(`combinedArgs: `, combinedArgs);

  e.preventDefault();

  const key = detectModifierKey(e);

  const commands =
    mode.current === "normal"
      ? NORMAL_COMMANDS
      : mode.current === "visual"
        ? VISUAL_COMMANDS
        : COMMON_COMMANDS;

  if (commands[key]) {
    // 1キーで該当のコマンドが見つかったら発火
    ({ start, end } = commands[key](combinedArgs) || { start, end });
    keyHistory = [];
  } else {
    // 見つからなければ、2つ目のキーとの組み合わせでコマンドを発火
    keyHistory.push(key);

    if (keyHistory.length > maxHistory) {
      keyHistory.shift();
    }

    const keyCombination = keyHistory.join(" ");

    for (const command in commands) {
      if (keyCombination.endsWith(command)) {
        ({ start, end } = commands[command](combinedArgs) || { start, end });
        keyHistory = [];
        break;
      }
    }
  }

  args.pos.current = { start, end };
  element.setSelectionRange(start, end);
};

export { handleKeyDown };
