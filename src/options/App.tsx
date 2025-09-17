import React, { useEffect, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import {
	loadShortcuts,
	saveShortcuts,
	getShortcutString,
	parseKeyboardEvent,
	validateShortcut,
	ShortcutConfig,
	DEFAULT_SHORTCUTS,
} from "../utils/shortcuts";

const styles = stylex.create({
	container: {
		padding: 20,
		fontFamily: "system-ui",
		fontSize: 14,
	},
	section: {
		marginBottom: 20,
	},
	subtitle: {
		marginBottom: 10,
		fontSize: 18,
		fontWeight: "bold",
	},
	inputGroup: {
		display: "flex",
		alignItems: "center",
		gap: 10,
	},
	input: {
		padding: "6px 12px",
		border: "1px solid #ccc",
		borderRadius: 4,
		minWidth: 150,
		backgroundColor: "#fff",
	},
	inputEditing: {
		backgroundColor: "#f0f8ff",
	},
	button: {
		padding: "6px 12px",
		border: "1px solid #ccc",
		borderRadius: 4,
		backgroundColor: "#fff",
		cursor: "pointer",
	},
	message: {
		padding: 10,
		borderRadius: 4,
	},
	messageError: {
		backgroundColor: "#ffebee",
		border: "1px solid #ffcdd2",
		color: "#c62828",
	},
	messageSuccess: {
		backgroundColor: "#e8f5e8",
		border: "1px solid #c8e6c9",
		color: "#2e7d32",
	},
});

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
		<div {...stylex.props(styles.container)}>
			<div {...stylex.props(styles.section)}>
				<h3 {...stylex.props(styles.subtitle)}>Normal Mode</h3>
				<div {...stylex.props(styles.inputGroup)}>
					<input
						type="text"
						value={
							isEditing
								? "入力待機中..."
								: getShortcutString(shortcuts.normal_mode)
						}
						readOnly
						{...stylex.props(styles.input, isEditing && styles.inputEditing)}
					/>
					<button
						{...stylex.props(styles.button)}
						onClick={isEditing ? handleCancel : handleEdit}
					>
						{isEditing ? "キャンセル" : "編集"}
					</button>
				</div>
			</div>
			{message && (
				<div
					{...stylex.props(
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
