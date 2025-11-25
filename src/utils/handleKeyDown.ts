import {
  COMMON_COMMANDS,
  INSERT_COMMANDS,
  NORMAL_COMMANDS,
  VISUAL_COMMANDS,
} from "@/commands";
import type { Args, Command, Keymap, Keymaps } from "@/utils";
import {
  type Badge,
  detectModifierKey,
  findCommand,
  getElement,
  getLines,
  getMaxKeyHistory,
  scrollToCaret,
  sendMessage,
} from "@/utils";
import {
  getTextLength,
  setSelectionRange as setSelection,
} from "./elementHelpers";

let keyHistory: string[] = [];

export const handleKeyDown = async (
  e: KeyboardEvent,
  args: Args,
  keymaps: Keymaps,
): Promise<Args> => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element) return { mode: args.mode, pos: args.pos };

  const { mode } = args;

  const combinedArgs = {
    mode,
    element,
    length: getTextLength(element),
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

      if (newMode && newMode !== mode) {
        sendMessage<Badge>({
          text: newMode,
        });
      }

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

  if (commandName && !keyHistory.length) {
    // 1キーで該当のコマンドが見つかったら発火
    newValues = await commands[commandName](combinedArgs);
    keyHistory = [];
  } else {
    // 見つからなければ、キー履歴に追加してコンビネーションで探す
    if (key) keyHistory.push(key);

    if (keyHistory.length > maxHistory) {
      keyHistory.shift();
    }

    const keyCombination = keyHistory.join(" ");
    commandName = findCommand(keyCombination, keymapsForMode, commands);

    if (commandName) {
      newValues = await commands[commandName](combinedArgs);
      keyHistory = [];
    }

    if (keyHistory.length === maxHistory) {
      keyHistory = [];
    }
  }

  const { mode: newMode, ...newPos } = newValues || {};

  setSelection(
    element,
    newPos.start ?? args.pos.start,
    newPos.end ?? args.pos.end,
  );

  // normal mode時にキャレットが見える範囲に自動スクロール
  if (mode === "normal") {
    scrollToCaret(element, newPos.start ?? args.pos.start);
  }

  if (newMode && newMode !== mode) {
    sendMessage<Badge>({
      text: newMode,
    });
  }

  return {
    pos: { ...args.pos, ...newPos },
    mode: newMode ?? mode,
  };
};
