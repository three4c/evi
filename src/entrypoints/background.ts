import { onKeymapsResponse, openSidePanel, sendKeymaps } from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsResponse(sendKeymaps);
});
