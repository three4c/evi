import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines.ts";
import { NORMAL_COMMANDS } from "../commands/normal.ts";
import { VISUAL_COMMANDS } from "../commands/visual.ts";
import { COMMON_COMMANDS } from "../commands/common.ts";
import type { Args, Command } from "../utils/types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let keyHistory: string[] = [];
const maxHistory = Math.max(
  ...[
    ...Object.keys(NORMAL_COMMANDS),
    ...Object.keys(VISUAL_COMMANDS),
    ...Object.keys(COMMON_COMMANDS),
  ].map((command) => command.split(" ").length),
);

const handleKeyDown = async (e: KeyboardEvent, args: Args) => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName)) return;

  const { mode } = args;

  if (!["normal", "visual"].includes(mode.current)) {
    return;
  }

  e.preventDefault();

  let { start, end } = args.pos.current;
  let { oStart, oEnd, oCurrentLine } = args.originalPos.current;
  const { currentLine: endCurrentLine } = getLines(element, end);
  const { lines, charCount, currentLine, col } = getLines(element, start);
  const { length } = element.value;
  const combinedArgs = {
    start,
    end,
    lines,
    charCount,
    currentLine,
    endCurrentLine,
    col,
    element,
    length,
    oStart,
    oEnd,
    oCurrentLine,
    ...args,
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
    // 見つからなければ、2つ目のキーとの組み合わせでコマンドを発火
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

  args.pos.current = { start, end };
  args.originalPos.current = { oStart, oEnd, oCurrentLine };
  element.setSelectionRange(start, end);
};

export { handleKeyDown };
