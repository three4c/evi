import { useCallback, useEffect, useState } from "react";
import { DEFAULT_KEYMAPS } from "@/keymaps";
import type { AllModeType, Keymaps } from "@/utils";
import {
  detectModifierKey,
  loadKeymaps,
  resetKeymaps,
  saveKeymaps,
} from "@/utils";
import { KeymapSection } from "./KeymapSection";
import "./App.scss";

const MESSAGE_DISPLAY_TIME = 3000;

const App: React.FC = () => {
  const [keymaps, setKeymaps] = useState<Keymaps>(DEFAULT_KEYMAPS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMode, setEditingMode] = useState<AllModeType | null>(null);
  const [editingCommand, setEditingCommand] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [currentKeySequence, setCurrentKeySequence] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");

  const validateKeySequence = (
    sequence: string[],
    mode: AllModeType,
    command: string,
  ) => {
    if (sequence.length === 0) {
      return "キーシーケンスが空です";
    }

    const allKeymapsForMode =
      mode === "common"
        ? {
            ...keymaps.common,
            ...keymaps.normal,
            ...keymaps.visual,
          }
        : { ...keymaps[mode], ...keymaps.common };
    const newKeyString = sequence.join(" ");

    // 重複チェック（現在編集中のコマンド以外）
    for (const [cmd, keyStr] of Object.entries(allKeymapsForMode)) {
      if (cmd !== command && keyStr === newKeyString) {
        return `キー "${newKeyString}" は既に "${cmd}" で使用されています`;
      }
    }

    // プレフィックス競合チェック
    for (const [cmd, keyStr] of Object.entries(allKeymapsForMode)) {
      if (cmd === command) continue;

      const existingKeys = keyStr.split(" ");

      // 既存の1キーマップが新しいシーケンスの最初のキーと同じ場合
      if (
        existingKeys.length === 1 &&
        sequence.length > 1 &&
        existingKeys[0] === sequence[0]
      ) {
        return `キー "${existingKeys[0]}" が既に "${cmd}" で使用されているため、"${newKeyString}" は設定できません`;
      }

      // 新しいシーケンスが1キーで、既存のマルチキーシーケンスの最初のキーと同じ場合
      if (
        sequence.length === 1 &&
        existingKeys.length > 1 &&
        sequence[0] === existingKeys[0]
      ) {
        return `キー "${sequence[0]}" は "${cmd}" のキーシーケンス "${keyStr}" と競合します`;
      }
    }

    return "";
  };

  const handleEdit = (mode: AllModeType, command: string) => {
    setIsEditing(true);
    setEditingMode(mode);
    setEditingCommand(command);
    setCurrentKeySequence([]);
    setValidationError("");
    setMessage("新しいキーを押してください...");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingMode(null);
    setEditingCommand(null);
    setCurrentKeySequence([]);
    setValidationError("");
    setMessage("");
  };

  const handleConfirm = async () => {
    if (!editingMode || !editingCommand || currentKeySequence.length === 0)
      return;

    const error = validateKeySequence(
      currentKeySequence,
      editingMode,
      editingCommand,
    );
    if (error) {
      setValidationError(error);
      return;
    }

    const newKeyString = currentKeySequence.join(" ");
    const updatedKeymaps = { ...keymaps };
    updatedKeymaps[editingMode][editingCommand] = newKeyString;

    setKeymaps(updatedKeymaps);
    setIsEditing(false);
    setEditingMode(null);
    setEditingCommand(null);
    setCurrentKeySequence([]);
    setValidationError("");

    await saveKeymaps(updatedKeymaps);
    setMessage("保存完了！");
    setTimeout(() => setMessage(""), MESSAGE_DISPLAY_TIME);
  };

  const updateKeymaps = useCallback((savedKeymaps: Keymaps) => {
    setKeymaps({
      common: { ...DEFAULT_KEYMAPS.common, ...savedKeymaps.common },
      insert: { ...DEFAULT_KEYMAPS.insert, ...savedKeymaps.insert },
      normal: { ...DEFAULT_KEYMAPS.normal, ...savedKeymaps.normal },
      visual: { ...DEFAULT_KEYMAPS.visual, ...savedKeymaps.visual },
    });
  }, []);

  const handleReset = async () => {
    setKeymaps(DEFAULT_KEYMAPS);
    await resetKeymaps();
    await loadKeymaps().then(updateKeymaps);
    setMessage("キーマップをデフォルトにリセットしました！");
    setTimeout(() => setMessage(""), MESSAGE_DISPLAY_TIME);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing || !editingMode || !editingCommand) return;

    if (["enter"].includes(e.key.toLowerCase())) {
      if (currentKeySequence.length > 0 && !validationError) {
        handleConfirm();
      } else {
        setMessage("有効なキーを入力してください");
      }
      return;
    }

    // キーボードで確定やキャンセルにフォーカスできるようにする
    if (["tab"].includes(e.key.toLowerCase())) {
      return;
    }

    e.preventDefault();

    if (["backspace", "delete"].includes(e.key.toLowerCase())) {
      setCurrentKeySequence((prev) => {
        const updated = prev.slice(0, -1);
        setMessage(
          updated.length > 0
            ? `キーシーケンス: ${updated.join(" ")}`
            : "新しいキーを押してください...",
        );
        return updated;
      });
      return;
    }

    const key = detectModifierKey(e.nativeEvent);

    const modifierKeys = ["ctrl", "alt", "meta", "cmd", "command"];
    if (modifierKeys.includes(e.key.toLowerCase())) {
      setMessage("追加のキーを押してください...");
      return;
    }

    if (e.key.length !== 1) {
      setMessage("文字キーを入力してください");
      return;
    }

    const newSequence = [...currentKeySequence, key];
    setCurrentKeySequence(newSequence);

    const error = validateKeySequence(newSequence, editingMode, editingCommand);
    setValidationError(error);

    if (error) {
      setMessage(`エラー: ${error}`);
    } else {
      setMessage(
        `キーシーケンス: ${newSequence.join(" ")} - 確定またはキャンセルしてください`,
      );
    }
  };

  useEffect(() => {
    loadKeymaps().then(updateKeymaps);
  }, [updateKeymaps]);

  const keymapSectionProps = {
    isEditing,
    editingMode,
    editingCommand,
    currentKeySequence,
    validationError,
    handleKeyDown,
    handleEdit,
    handleConfirm,
    handleCancel,
  };

  return (
    <div className="App">
      <KeymapSection
        title="Insert Mode Keymaps"
        mode="insert"
        keymap={keymaps.insert}
        {...keymapSectionProps}
      />
      <KeymapSection
        title="Normal Mode Keymaps"
        mode="normal"
        keymap={keymaps.normal}
        {...keymapSectionProps}
      />
      <KeymapSection
        title="Visual Mode Keymaps"
        mode="visual"
        keymap={keymaps.visual}
        {...keymapSectionProps}
      />
      <KeymapSection
        title="Normal / Visual Keymaps"
        mode="common"
        keymap={keymaps.common}
        {...keymapSectionProps}
      />

      <button
        type="button"
        className="App__button App__button--reset"
        onClick={handleReset}
        disabled={isEditing}
      >
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
