import { onKeymapsTabMessaged, openSidePanel } from "@/utils/";

export default defineBackground(() => {
  openSidePanel();
  onKeymapsTabMessaged();
});
