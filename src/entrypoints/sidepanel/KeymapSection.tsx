import {
  faCircleCheck,
  faCircleXmark,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { DEFAULT_KEYMAPS } from "@/keymaps";
import type { AllModeType, Keymap, Keymaps } from "@/utils";
import { detectModifierKey, saveKeymaps } from "@/utils";

interface BaseKeymapProps {
  mode: AllModeType;
  setIsEditing: (isEditing: boolean) => void;
  showMessage: (message: string) => void;
}

interface KeymapItemProps extends BaseKeymapProps {
  command: string;
  keyValue: string;
  setKeymaps: React.Dispatch<React.SetStateAction<Keymaps>>;
  keymaps: Keymaps;
}

interface KeymapSectionProps extends BaseKeymapProps {
  title: string;
  keymap: Keymap;
  setKeymaps: React.Dispatch<React.SetStateAction<Keymaps>>;
}

const KeymapItem: React.FC<KeymapItemProps> = (props) => {
  const [editingMode, setEditingMode] = useState<AllModeType | null>(null);
  const [editingCommand, setEditingCommand] = useState<string | null>(null);
  const [currentKeySequence, setCurrentKeySequence] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const validateKeySequence = (
    sequence: string[],
    mode: AllModeType,
    command: string,
  ) => {
    if (sequence.length === 0) return "キーシーケンスが空です";

    const allKeymapsForMode =
      mode === "common"
        ? {
            ...props.keymaps.common,
            ...props.keymaps.normal,
            ...props.keymaps.visual,
          }
        : { ...props.keymaps[mode], ...props.keymaps.common };
    const newKeyString = sequence.join(" ");

    for (const [cmd, keyStr] of Object.entries(allKeymapsForMode)) {
      if (cmd !== command && keyStr === newKeyString) {
        return `キー "${newKeyString}" は既に "${cmd}" で使用されています`;
      }
    }

    for (const [cmd, keyStr] of Object.entries(allKeymapsForMode)) {
      if (cmd === command) continue;
      const existingKeys = keyStr.split(" ");

      if (
        existingKeys.length === 1 &&
        sequence.length > 1 &&
        existingKeys[0] === sequence[0]
      ) {
        return `キー "${existingKeys[0]}" が既に "${cmd}" で使用されています`;
      }

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

  const handleEdit = (mode: AllModeType, command: string) => () => {
    setEditingMode(mode);
    setEditingCommand(command);
    setCurrentKeySequence([]);
    setValidationError("");
    props.setIsEditing(true);
    props.showMessage("新しいキーを押してください...");
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    setEditingMode(null);
    setEditingCommand(null);
    setCurrentKeySequence([]);
    setValidationError("");
    props.setIsEditing(false);
    props.showMessage("");
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
      props.showMessage(`エラー: ${error}`);
      return;
    }

    const newKeyString = currentKeySequence.join(" ");
    props.setKeymaps((prev) => {
      const updated = { ...prev };
      updated[editingMode][editingCommand] = newKeyString;
      return updated;
    });

    setEditingMode(null);
    setEditingCommand(null);
    setCurrentKeySequence([]);
    setValidationError("");
    props.setIsEditing(false);

    await saveKeymaps({
      ...props.keymaps,
      [editingMode]: {
        ...props.keymaps[editingMode],
        [editingCommand]: newKeyString,
      },
    });

    props.showMessage("保存完了！");
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!editingMode || !editingCommand) return;
    e.preventDefault();

    if (e.key.toLowerCase() === "enter") {
      if (currentKeySequence.length > 0 && !validationError) handleConfirm();
      else props.showMessage("有効なキーを入力してください");
      return;
    }

    if (["tab"].includes(e.key.toLowerCase())) return;

    if (["backspace", "delete"].includes(e.key.toLowerCase())) {
      setCurrentKeySequence((prev) => {
        const updated = prev.slice(0, -1);
        props.showMessage(
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
      props.showMessage("追加のキーを押してください...");
      return;
    }

    if (e.key.length !== 1) {
      props.showMessage("文字キーを入力してください");
      return;
    }

    const newSequence = [...currentKeySequence, key];
    setCurrentKeySequence(newSequence);

    const error = validateKeySequence(newSequence, editingMode, editingCommand);
    setValidationError(error);
    props.showMessage(
      error
        ? `エラー: ${error}`
        : `キーシーケンス: ${newSequence.join(" ")} - 確定またはキャンセルしてください`,
    );
  };

  const isActive =
    editingMode === props.mode && editingCommand === props.command;

  return (
    <div key={props.command} className="App__inputGroup">
      <label className="App__label" htmlFor={`App__input--${props.command}`}>
        {props.command.replaceAll("_", " ")}:
      </label>
      <input
        id={`App__input--${props.command}`}
        type="text"
        value={
          isActive
            ? currentKeySequence.join(" ") || "待機中..."
            : props.keyValue
        }
        readOnly
        className={`App__input ${isActive ? "App__input--editing" : ""} ${
          validationError && isActive ? "App__input--error" : ""
        }`}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {isActive ? (
        <div className="App__buttonGroup">
          <button
            type="button"
            className="App__button App__button--confirm"
            onClick={handleConfirm}
            disabled={currentKeySequence.length === 0 || !!validationError}
            aria-label="確定"
          >
            <FontAwesomeIcon icon={faCircleCheck} />
          </button>
          <button
            type="button"
            className="App__button App__button--cancel"
            onClick={handleCancel}
            aria-label="キャンセル"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="App__button"
          onClick={handleEdit(props.mode, props.command)}
          aria-label="編集"
          ref={buttonRef}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      )}
    </div>
  );
};

export const KeymapSection: React.FC<KeymapSectionProps> = (props) => (
  <div className="App__section">
    <h3 className="App__subtitle">{props.title}</h3>
    {Object.entries(props.keymap).map(([command, keyValue]) => (
      <KeymapItem
        key={command}
        command={command}
        keyValue={keyValue}
        keymaps={DEFAULT_KEYMAPS}
        {...props}
      />
    ))}
  </div>
);
