import { useRef } from "react";
import type { AllModeType, Keymap } from "@/utils";

interface BaseKeymapProps {
  mode: AllModeType;
  isEditing: boolean;
  editingMode: AllModeType | null;
  editingCommand: string | null;
  currentKeySequence: string[];
  validationError: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleEdit: (mode: AllModeType, command: string) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

interface KeymapItemProps extends BaseKeymapProps {
  command: string;
  keyValue: string;
}

interface KeymapSectionProps extends BaseKeymapProps {
  title: string;
  keymap: Keymap;
}

const KeymapItem: React.FC<KeymapItemProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    props.handleEdit(props.mode, props.command);
    inputRef.current?.focus();
  };

  return (
    <div key={props.command} className="App__inputGroup">
      <label className="App__label" htmlFor={`App__input--${props.command}`}>
        {props.command.replaceAll("_", " ")}:
      </label>
      <input
        id={`App__input--${props.command}`}
        type="text"
        value={
          props.isEditing &&
          props.editingMode === props.mode &&
          props.editingCommand === props.command
            ? props.currentKeySequence.join(" ") || "待橿中..."
            : props.keyValue
        }
        readOnly
        className={`App__input ${
          props.isEditing &&
          props.editingMode === props.mode &&
          props.editingCommand === props.command
            ? "App__input--editing"
            : ""
        } ${
          props.validationError &&
          props.editingMode === props.mode &&
          props.editingCommand === props.command
            ? "App__input--error"
            : ""
        }`}
        onKeyDown={props.handleKeyDown}
        onFocus={handleEdit}
        ref={inputRef}
      />
      {props.isEditing &&
      props.editingMode === props.mode &&
      props.editingCommand === props.command ? (
        <div className="App__buttonGroup">
          <button
            type="button"
            className="App__button App__button--confirm"
            onClick={props.handleConfirm}
            disabled={
              props.currentKeySequence.length === 0 || !!props.validationError
            }
            aria-label="確定"
          >
            &#9989;
          </button>
          <button
            type="button"
            className="App__button App__button--cancel"
            onClick={props.handleCancel}
            aria-label="キャンセル"
          >
            &#10060;
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="App__button"
          onClick={handleEdit}
          disabled={props.isEditing}
          aria-label="編集"
        >
          &#x270F;&#xFE0F;
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
        {...props}
      />
    ))}
  </div>
);
