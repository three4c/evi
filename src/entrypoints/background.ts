import {
  type Badge,
  onKeymapsChangedMessaged,
  onMessage,
  onUpdate,
  openSidePanel,
  saveBadge,
} from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsChangedMessaged();
  onMessage<Badge>((badge, tabId) => saveBadge(badge, tabId));
  onUpdate((tabId) => saveBadge({ text: "insert" }, tabId));
});
