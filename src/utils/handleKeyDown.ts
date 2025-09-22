import {
  COMMON_COMMANDS,
  INSERT_COMMANDS,
  NORMAL_COMMANDS,
  VISUAL_COMMANDS,
} from "@/commands";
import type { Args, Command, Keymap } from "@/utils";
import {
  detectModifierKey,
  findCommand,
  getElement,
  getKeymaps,
  getLines,
  getMaxKeyHistory,
} from "@/utils";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];
let keyHistory: string[] = [];

export const handleKeyDown = async (
  e: KeyboardEvent,
  args: Args,
): Promise<Args> => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName))
    return { mode: args.mode, pos: args.pos };

  const { mode } = args;
  const keymaps = await getKeymaps();

  const combinedArgs = {
    mode,
    element,
    length: element.value.length,
    endCurrentLine: getLines(element, args.pos.end).currentLine,
    ...args.pos,
    ...getLines(element, args.pos.start),
  };

  if (!["normal", "visual"].includes(mode)) {
    const key = detectModifierKey(e);
    const commandName = findCommand(key, keymaps.insert, INSERT_COMMANDS);
    if (commandName) {
      const newValues = await INSERT_COMMANDS[commandName](combinedArgs);
      keyHistory = [];
      const { mode: newMode, ...newPos } = newValues || {};
      return {
        pos: { ...args.pos, ...newPos },
        mode: newMode ?? mode,
      };
    }

    return args;
  }

  e.preventDefault();

  const maxHistory = getMaxKeyHistory(keymaps);

  let newValues: ReturnType<Command> = {};
  const key = detectModifierKey(e);

  const keymapsForMode: Keymap = {
    ...keymaps[mode],
    ...keymaps.common,
  };
  let commands: Record<string, Command> = {};
  if (mode === "normal") {
    commands = { ...NORMAL_COMMANDS, ...COMMON_COMMANDS };
  }
  if (mode === "visual") {
    commands = { ...VISUAL_COMMANDS, ...COMMON_COMMANDS };
  }

  // 1キーのコマンドを探す
  let commandName = findCommand(key, keymapsForMode, commands);

  if (commandName) {
    // 1キーで該当のコマンドが見つかったら発火
    newValues = await commands[commandName](combinedArgs);
    keyHistory = [];
  } else {
    // 見つからなければ、キー履歴に追加してコンビネーションで探す
    keyHistory.push(key);

    if (keyHistory.length > maxHistory) {
      keyHistory.shift();
    }

    const keyCombination = keyHistory.join(" ");
    commandName = findCommand(keyCombination, keymapsForMode, commands);

    if (commandName) {
      newValues = await commands[commandName](combinedArgs);
      keyHistory = [];
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
