export type MODE_TYPE = "normal" | "insert" | "visual";

type POS_TYPE = {
  start: number;
  end: number;
};

type ORIGINAL_POS_TYPE =
  | {
      start: number;
      end: number;
      currentLine: number;
    }
  | undefined;

export type Args = {
  mode: React.RefObject<MODE_TYPE>;
  pos: React.RefObject<POS_TYPE>;
  originalPos: React.RefObject<ORIGINAL_POS_TYPE>;
};

export interface CombinedArgs extends Args {
  start: number;
  end: number;
  currentLine: number;
  endCurrentLine: number;
  lines: string[];
  charCount: number;
  col: number;
  element: HTMLInputElement | HTMLTextAreaElement;
}

export type Command = (
  args: CombinedArgs,
) => Promise<POS_TYPE | void> | POS_TYPE | void;
