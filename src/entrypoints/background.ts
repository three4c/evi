import {
  type Badge,
  modeMap,
  onKeymapsChangedMessaged,
  onMessage,
  openSidePanel,
  saveBadge,
} from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsChangedMessaged();
  saveBadge(modeMap.insert.text, modeMap.insert.color);
  onMessage<Badge>(({ text, color }) => saveBadge(text, color));
});
