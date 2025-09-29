import { onKeymapsChangedMessaged, openSidePanel } from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsChangedMessaged();
});
