const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

export interface ShortcutConfig {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

// Command + Shift + e (Mac)
export const DEFAULT_SHORTCUTS = {
  normal_mode: {
    key: "e",
    ctrlKey: !isMac,
    shiftKey: true,
    metaKey: isMac,
    altKey: false,
  },
};

export const matchesShortcut = (
  event: KeyboardEvent,
  shortcut: ShortcutConfig,
): boolean => {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    event.ctrlKey === shortcut.ctrlKey &&
    event.shiftKey === shortcut.shiftKey &&
    event.metaKey === shortcut.metaKey &&
    event.altKey === shortcut.altKey
  );
};

export const getShortcutString = (shortcut: ShortcutConfig): string => {
  const modifiers = [];
  if (shortcut.ctrlKey) modifiers.push("Ctrl");
  if (shortcut.metaKey) modifiers.push("Cmd");
  if (shortcut.shiftKey) modifiers.push("Shift");
  if (shortcut.altKey) modifiers.push("Alt");

  return [...modifiers, shortcut.key.toUpperCase()].join("+");
};

export const parseKeyboardEvent = (event: KeyboardEvent): ShortcutConfig => {
  return {
    key: event.key.toLowerCase(),
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
  };
};

export const validateShortcut = (shortcut: ShortcutConfig): string | null => {
  if (!shortcut.ctrlKey && !shortcut.metaKey) {
    return "修飾キー（Ctrl または Cmd）が必要です";
  }

  // 装飾キーのみの場合は無視（エラーを返さない）
  const modifierKeys = ['control', 'shift', 'alt', 'meta', 'cmd', 'command'];
  if (modifierKeys.includes(shortcut.key.toLowerCase())) {
    return null;
  }

  if (
    shortcut.key.length !== 1 &&
    ![
      "f1",
      "f2",
      "f3",
      "f4",
      "f5",
      "f6",
      "f7",
      "f8",
      "f9",
      "f10",
      "f11",
      "f12",
    ].includes(shortcut.key.toLowerCase())
  ) {
    return "有効なキーを入力してください";
  }

  const reserved = [
    "ctrl+t",
    "ctrl+w",
    "ctrl+n",
    "ctrl+r",
    "ctrl+l",
    "ctrl+d",
    "cmd+t",
    "cmd+w",
    "cmd+n",
    "cmd+r",
    "cmd+l",
    "cmd+d",
  ];

  const shortcutStr = getShortcutString(shortcut).toLowerCase();
  if (reserved.includes(shortcutStr)) {
    return "このショートカットは予約されています";
  }

  return null;
};

export const saveShortcuts = async (
  shortcuts: Record<string, ShortcutConfig>,
): Promise<void> => {
  await chrome.storage.sync.set({ shortcuts });
};

export const loadShortcuts = async (): Promise<
  Record<string, ShortcutConfig>
> => {
  const result = await chrome.storage.sync.get(["shortcuts"]);
  return result.shortcuts || DEFAULT_SHORTCUTS;
};

export const onShortcutsChanged = (
  callback: (shortcuts: Record<string, ShortcutConfig>) => void,
): void => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.shortcuts) {
      callback(changes.shortcuts.newValue || DEFAULT_SHORTCUTS);
    }
  });
};

