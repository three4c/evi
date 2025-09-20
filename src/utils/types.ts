export type MODE_TYPE = "normal" | "insert" | "visual";

type POS_TYPE = {
  start: number;
  end: number;
};

type ORIGINAL_POS_TYPE = {
  oStart: number;
  oEnd: number;
  oCurrentLine: number;
};

export type Args = {
  mode: React.RefObject<MODE_TYPE>;
  pos: React.RefObject<POS_TYPE>;
  originalPos: React.RefObject<ORIGINAL_POS_TYPE>;
};

export interface CombinedArgs extends POS_TYPE, ORIGINAL_POS_TYPE, Args {
  currentLine: number;
  endCurrentLine: number;
  lines: string[];
  charCount: number;
  col: number;
  element: HTMLInputElement | HTMLTextAreaElement;
  length: number;
}

export type Command = (
  args: CombinedArgs,
) =>
  | Promise<POS_TYPE | ORIGINAL_POS_TYPE | void>
  | POS_TYPE
  | ORIGINAL_POS_TYPE
  | void;
