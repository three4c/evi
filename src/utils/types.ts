export type MODE_TYPE = "normal" | "insert" | "visual";

type Positions = {
  start: number;
  end: number;
  oStart: number;
  oEnd: number;
  oCurrentLine: number;
};

export type Args = {
  mode: React.RefObject<MODE_TYPE>;
  pos: React.RefObject<Positions>;
};

export interface CombinedArgs extends Positions, Args {
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
) => Promise<Partial<Positions> | void> | Partial<Positions> | void;
