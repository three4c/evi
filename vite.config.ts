import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import styleX from "vite-plugin-stylex";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), styleX(), crx({ manifest })],
});
