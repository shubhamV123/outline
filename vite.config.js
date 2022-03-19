import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { copyFiles } from "./build-utils.js";

// https://vitejs.dev/config/
export default defineConfig(({ command, node, mode }) => {
  const devPlugins = [];
  if (mode === "staging") {
    devPlugins.push(copyFiles());
  }
  return {
    plugins: [react(), ...devPlugins],
  };
});
