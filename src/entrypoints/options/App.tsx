import { useEffect, useState } from "react";
import {
  DEFAULT_SHORTCUTS,
  getShortcutString,
  loadShortcuts,
  parseKeyboardEvent,
  type ShortcutConfig,
  saveShortcuts,
  validateShortcut,
} from "../../utils/shortcuts";
import "./App.scss";

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

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;

      e.preventDefault();

      const newShortcut = parseKeyboardEvent(e);

      const modifierKeys = [
        "control",
        "shift",
        "alt",
        "meta",
        "cmd",
        "command",
      ];
      if (modifierKeys.includes(newShortcut.key.toLowerCase())) {
        setMessage("追加のキーを押してください...");
        return;
      }

      const error = validateShortcut(newShortcut);
      if (error) {
        setMessage(`エラー: ${error}`);
        return;
      }

      const updatedShortcuts = { ...shortcuts, normal_mode: newShortcut };
      setShortcuts(updatedShortcuts);
      setIsEditing(false);

      saveShortcuts(updatedShortcuts).then(() => {
        setMessage("保存完了！");
        setTimeout(() => setMessage(""), 3000);
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, shortcuts]);

  return (
    <div className="App">
      <div className="App__section">
        <h3 className="App__subtitle">Normal Mode</h3>
        <div className="App__input-group">
          <input
            type="text"
            value={
              isEditing
                ? "入力待機中..."
                : getShortcutString(shortcuts.normal_mode)
            }
            readOnly
            className={`App__input ${isEditing ? "App__input--editing" : ""}`}
          />
          <button
            type="button"
            className="App__button"
            onClick={isEditing ? handleCancel : handleEdit}
          >
            {isEditing ? "キャンセル" : "編集"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`App__message ${
            message.includes("エラー")
              ? "App__message--error"
              : "App__message--success"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
