import { useEffect, useState } from "react";
import {
  COMMON_KEYMAPS,
  INSERT_KEYMAPS,
  NORMAL_KEYMAPS,
  VISUAL_KEYMAPS,
} from "@/keymaps";
import {
  detectModifierKey,
  loadKeymaps,
  resetKeymaps,
  saveKeymaps,
} from "../../utils";
import "./App.scss";

const App: React.FC = () => {
  const [keymaps, setKeymaps] = useState<{
    common: Record<string, string>;
    insert: Record<string, string>;
    normal: Record<string, string>;
    visual: Record<string, string>;
  }>({
    common: COMMON_KEYMAPS,
    insert: INSERT_KEYMAPS,
    normal: NORMAL_KEYMAPS,
    visual: VISUAL_KEYMAPS,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingMode, setEditingMode] = useState<string | null>(null);
  const [editingCommand, setEditingCommand] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleEdit = (mode: string, command: string) => {
    setIsEditing(true);
    setEditingMode(mode);
    setEditingCommand(command);
    setMessage("新しいキーを押してください...");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingMode(null);
    setEditingCommand(null);
    setMessage("");
  };

  const handleReset = () => {
    const defaultKeymaps = {
      common: COMMON_KEYMAPS,
      insert: INSERT_KEYMAPS,
      normal: NORMAL_KEYMAPS,
      visual: VISUAL_KEYMAPS,
    };
    setKeymaps(defaultKeymaps);
    resetKeymaps().then(() => {
      setMessage("キーマップをデフォルトにリセットしました！");
      setTimeout(() => setMessage(""), 3000);
    });
  };

  useEffect(() => {
    loadKeymaps().then((savedKeymaps) => {
      setKeymaps({
        common: { ...COMMON_KEYMAPS, ...savedKeymaps.common },
        insert: { ...INSERT_KEYMAPS, ...savedKeymaps.insert },
        normal: { ...NORMAL_KEYMAPS, ...savedKeymaps.normal },
        visual: { ...VISUAL_KEYMAPS, ...savedKeymaps.visual },
      });
    });
  }, []);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return;

      e.preventDefault();

      const key = detectModifierKey(e);

      const modifierKeys = ["ctrl", "alt", "meta", "cmd", "command"];
      if (modifierKeys.includes(e.key.toLowerCase())) {
        setMessage("追加のキーを押してください...");
        return;
      }

      if (e.key.length !== 1) {
        setMessage("文字キーを入力してください");
        return;
      }

      const updatedKeymaps = { ...keymaps };
      if (editingMode && editingCommand) {
        updatedKeymaps[editingMode as keyof typeof updatedKeymaps][
          editingCommand
        ] = key;
        setKeymaps(updatedKeymaps);
        setIsEditing(false);
        setEditingMode(null);
        setEditingCommand(null);

        saveKeymaps(updatedKeymaps).then(() => {
          setMessage("保存完了！");
          setTimeout(() => setMessage(""), 3000);
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, keymaps, editingMode, editingCommand]);

  const renderKeymapSection = (
    title: string,
    mode: string,
    keymapObj: Record<string, string>,
  ) => (
    <div className="App__section">
      <h3 className="App__subtitle">{title}</h3>
      {Object.entries(keymapObj).map(([command, key]) => (
        <div key={command} className="App__input-group">
          <label className="App__label" htmlFor={`App__input-${command}`}>
            {command.replaceAll("_", " ")}:
          </label>
          <input
            id={`App__input-${command}`}
            type="text"
            value={
              isEditing && editingMode === mode && editingCommand === command
                ? "待機中..."
                : key
            }
            readOnly
            className={`App__input ${
              isEditing && editingMode === mode && editingCommand === command
                ? "App__input--editing"
                : ""
            }`}
          />
          <button
            type="button"
            className="App__button"
            onClick={
              isEditing && editingMode === mode && editingCommand === command
                ? handleCancel
                : () => handleEdit(mode, command)
            }
            disabled={
              isEditing && !(editingMode === mode && editingCommand === command)
            }
          >
            {isEditing && editingMode === mode && editingCommand === command
              ? "キャンセル"
              : "編集"}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      {renderKeymapSection("Insert Mode Keymaps", "insert", keymaps.insert)}
      {renderKeymapSection("Normal Mode Keymaps", "normal", keymaps.normal)}
      {renderKeymapSection("Visual Mode Keymaps", "visual", keymaps.visual)}
      {renderKeymapSection("Common Keymaps", "common", keymaps.common)}

      <button type="button" onClick={handleReset} disabled={isEditing}>
        デフォルトにリセット
      </button>

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
