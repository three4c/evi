import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_KEYMAPS } from "@/keymaps";
import type { Keymaps } from "@/utils";
import { loadKeymaps, resetKeymaps } from "@/utils";
import styles from "./App.module.scss";
import { KeymapSection } from "./KeymapSection";

const MESSAGE_DISPLAY_TIME = 3000;

const App: React.FC = () => {
  const [keymaps, setKeymaps] = useState<Keymaps>(DEFAULT_KEYMAPS);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), MESSAGE_DISPLAY_TIME);
  }, []);

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
    showMessage("キーマップをデフォルトにリセットしました！");
  };

  useEffect(() => {
    loadKeymaps().then(updateKeymaps);
  }, [updateKeymaps]);

  return (
    <div className={styles.App}>
      {(["insert", "normal", "visual", "common"] as const).map((mode) => (
        <KeymapSection
          key={mode}
          title={`${mode[0].toUpperCase() + mode.slice(1)} Mode Keymaps`}
          mode={mode}
          keymap={keymaps[mode]}
          setKeymaps={setKeymaps}
          setIsEditing={setIsEditing}
          showMessage={showMessage}
        />
      ))}

      <button
        type="button"
        className={clsx(styles.App__button, styles["App__button--reset"])}
        onClick={handleReset}
        disabled={isEditing}
      >
        デフォルトにリセット
      </button>

      {message && (
        <div
          className={clsx(styles.App__message, {
            [styles["App__message--error"]]: message.includes("エラー"),
            [styles["App__message--success"]]: !message.includes("エラー"),
          })}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
