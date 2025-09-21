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
  mode: MODE_TYPE;
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

/** Vimコマンド関数のシグニチャ */
export type Command = (
  args: CombinedArgs,
) =>
  | Promise<Partial<Positions & { mode?: MODE_TYPE }> | undefined>
  | Partial<Positions & { mode?: MODE_TYPE }>
  | undefined;
