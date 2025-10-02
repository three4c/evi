import {
  type Badge,
  onKeymapsChangedMessaged,
  onMessage,
  openSidePanel,
  saveBadge,
} from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsChangedMessaged();
  onMessage<Badge>((badge, tabId) => saveBadge(badge, tabId));
});
