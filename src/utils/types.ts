export type ModeType = "normal" | "insert" | "visual";

export type Positions = {
  start: number;
  end: number;
  /** visual mode に入る前の `start` */
  oStart: number;
  /** visual mode に入る前の `end` */
  oEnd: number;
  /** visual mode に入る前の `currentLine` */
  oCurrentLine: number;
};

export type Args = {
  mode: ModeType;
  pos: Positions;
};

/** handleKeyDown() に渡される引数、Vimコマンドの実装に必要な情報 */
export interface CombinedArgs extends Positions, Omit<Args, "pos"> {
  currentLine: number;
  endCurrentLine: number;
  lines: string[];
  charCount: number;
  col: number;
  element: HTMLInputElement | HTMLTextAreaElement;
  length: number;
}

export type Keymap = Record<string, string>;

export type Keymaps = {
  common: Keymap;
  insert: Keymap;
  normal: Keymap;
  visual: Keymap;
};

export interface Badge {
  text: ModeType;
}

/** Vimコマンド関数のシグニチャ */
export type Command = (
  args: CombinedArgs,
) =>
  | Promise<Partial<Positions & { mode?: ModeType }> | undefined>
  | Partial<Positions & { mode?: ModeType }>
  | undefined;

interface DummyCaretProps {
  _dummyCaretHost?: HTMLDivElement;
  _dummyCaret?: HTMLDivElement;
}
type TextAreaElement = HTMLTextAreaElement & DummyCaretProps;
type InputElement = HTMLInputElement & DummyCaretProps;
export type ElementType = TextAreaElement | InputElement | null;
