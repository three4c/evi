import type React from "react";
import { useEffect, useState } from "react";
import {
  loadShortcuts,
  saveShortcuts,
  getShortcutString,
  parseKeyboardEvent,
  validateShortcut,
  type ShortcutConfig,
  DEFAULT_SHORTCUTS,
} from "../utils";
import { styleX, styles } from "./App.styles";

const App: React.FC = () => {
  const [shortcuts, setShortcuts] =
    useState<Record<string, ShortcutConfig>>(DEFAULT_SHORTCUTS);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadShortcuts().then(setShortcuts);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("キーの組み合わせを押してください...");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditing) return;

    e.preventDefault();

    const newShortcut = parseKeyboardEvent(e);

    // 装飾キーのみの場合は待機メッセージを表示
    const modifierKeys = ["control", "shift", "alt", "meta", "cmd", "command"];
    if (modifierKeys.includes(newShortcut.key.toLowerCase())) {
      setMessage("追加のキーを押してください...");
      return;
    }

    const error = validateShortcut(newShortcut);

    if (error) {
      setMessage(`エラー: ${error}`);
      return;
    }

    const updatedShortcuts = {
      ...shortcuts,
      normal_mode: newShortcut,
    };

    setShortcuts(updatedShortcuts);
    setIsEditing(false);

    saveShortcuts(updatedShortcuts).then(() => {
      setMessage("保存完了！");
      setTimeout(() => setMessage(""), 3000);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isEditing, shortcuts]);

  return (
    <div {...styleX.props(styles.container)}>
      <div {...styleX.props(styles.section)}>
        <h3 {...styleX.props(styles.subtitle)}>Normal Mode</h3>
        <div {...styleX.props(styles.inputGroup)}>
          <input
            type="text"
            value={
              isEditing
                ? "入力待機中..."
                : getShortcutString(shortcuts.normal_mode)
            }
            readOnly
            {...styleX.props(styles.input, isEditing && styles.inputEditing)}
          />
          <button
            {...styleX.props(styles.button)}
            onClick={isEditing ? handleCancel : handleEdit}
          >
            {isEditing ? "キャンセル" : "編集"}
          </button>
        </div>
      </div>
      {message && (
        <div
          {...styleX.props(
            styles.message,
            message.includes("エラー")
              ? styles.messageError
              : styles.messageSuccess,
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
