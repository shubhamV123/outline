import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy-watch";

// https://vitejs.dev/config/
export default defineConfig(({ command, node, mode }) => {
  const devPlugins = [];
  if (mode === "staging") {
    devPlugins.push(
      copy({
        watch: ["chrome/**"],
        targets: [
          // { src: "chrome/background.js", dest: "dist" },
          // { src: "chrome/content-script.js", dest: "dist" },
          { src: "chrome/manifest.json", dest: "dist" },
        ],
      })
    );
  }
  return {
    plugins: [react(), ...devPlugins],
  };
});
