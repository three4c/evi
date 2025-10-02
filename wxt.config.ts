import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  webExt: {
    startUrls: ["dev/index.html"],
  },
  manifest: {
    permissions: ["storage", "clipboardRead", "sidePanel"],
    action: {
      default_title: "evi - displays current mode",
      default_icon: {},
    },
  },
});
