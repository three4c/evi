import { COMMON_COMMANDS } from "@/commands/common";
import { INSERT_COMMANDS } from "@/commands/insert";
import { NORMAL_COMMANDS } from "@/commands/normal";
import { VISUAL_COMMANDS } from "@/commands/visual";
import { COMMON_KEYMAPS } from "@/keymaps/common";
import { INSERT_KEYMAPS } from "@/keymaps/insert";
import { NORMAL_KEYMAPS } from "@/keymaps/normal";
import { VISUAL_KEYMAPS } from "@/keymaps/visual";
import { detectModifierKey } from "./detectModifierKey";
import { getElement } from "./getElement";
import { getLines } from "./getLines";
import { loadKeymaps } from "./shortcuts";
import type { Args, Command } from "./types";

const DOM_ARRAY = ["INPUT", "TEXTAREA"];

let keyHistory: string[] = [];
let cachedKeymaps: {
  common: Record<string, string>;
  insert: Record<string, string>;
  normal: Record<string, string>;
  visual: Record<string, string>;
} | null = null;

const getKeymaps = async () => {
  if (!cachedKeymaps) {
    const savedKeymaps = await loadKeymaps();
    cachedKeymaps = {
      common: { ...COMMON_KEYMAPS, ...savedKeymaps.common },
      insert: { ...INSERT_KEYMAPS, ...savedKeymaps.insert },
      normal: { ...NORMAL_KEYMAPS, ...savedKeymaps.normal },
      visual: { ...VISUAL_KEYMAPS, ...savedKeymaps.visual },
    };
  }
  return cachedKeymaps;
};

const getMaxHistory = (keymaps: {
  common: Record<string, string>;
  insert: Record<string, string>;
  normal: Record<string, string>;
  visual: Record<string, string>;
}) => {
  return Math.max(
    ...[
      ...Object.keys(keymaps.normal),
      ...Object.keys(keymaps.visual),
      ...Object.keys(keymaps.common),
      ...Object.keys(keymaps.insert),
    ].map((command) => command.split(" ").length),
  );
};

const findCommand = (
  searchKey: string,
  keymaps: Record<string, string>,
  commands: Record<string, Command>,
) => {
  const commandName =
    Object.keys(keymaps).find((k) => keymaps[k] === searchKey) || "";
  return commands[commandName] ? commandName : null;
};

export const handleKeyDown = async (
  e: KeyboardEvent,
  args: Args,
): Promise<Args> => {
  const activeElement = document.activeElement;
  const element = getElement(activeElement);
  if (!element || !DOM_ARRAY.includes(element.tagName))
    return { mode: args.mode, pos: args.pos };

  const currentKeymaps = await getKeymaps();
  const { mode } = args;

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
    const commandName = findCommand(
      key,
      currentKeymaps.insert,
      INSERT_COMMANDS,
    );
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

  const maxHistory = getMaxHistory(currentKeymaps);

  let newValues: ReturnType<Command> = {};
  const key = detectModifierKey(e);

  let commands: Record<string, Command> = {};
  let keymaps: Record<string, string> = {};
  if (mode === "normal") {
    commands = { ...NORMAL_COMMANDS, ...COMMON_COMMANDS };
    keymaps = { ...currentKeymaps.normal, ...currentKeymaps.common };
  }
  if (mode === "visual") {
    commands = { ...VISUAL_COMMANDS, ...COMMON_COMMANDS };
    keymaps = { ...currentKeymaps.visual, ...currentKeymaps.common };
  }

  // 1キーのコマンドを探す
  let commandName = findCommand(key, keymaps, commands);

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
    commandName = findCommand(keyCombination, keymaps, commands);

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
