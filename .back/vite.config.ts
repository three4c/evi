import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import styleX from "vite-plugin-stylex";
import manifest from "./manifest.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), styleX(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        options: "options.html",
      },
    },
  },
});
