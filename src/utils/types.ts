export type MODE_TYPE = "normal" | "insert" | "visual";

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
  mode: React.RefObject<MODE_TYPE>;
  pos: React.RefObject<Positions>;
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

/**
 * Vimコマンド関数のシグニチャ
 * 新しいPositionを返却する。
 * 部分的な返却が可能で、不足している部分は前回の値が再利用される
 */
export type Command = (
  args: CombinedArgs,
) => Promise<Partial<Positions> | void> | Partial<Positions> | void;
