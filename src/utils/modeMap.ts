import type { MODE_TYPE } from "@/utils";

export const modeMap: Record<
  MODE_TYPE,
  { text: "INS" | "NOR" | "VIS"; color: [number, number, number, number] }
> = {
  insert: { text: "INS", color: [75, 175, 75, 255] },
  normal: { text: "NOR", color: [100, 149, 237, 255] },
  visual: { text: "VIS", color: [255, 140, 0, 255] },
};
