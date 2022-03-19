import { terser } from "rollup-plugin-terser";
import { copyFiles, FILES_TO_WATCH } from "./build-utils";

const plugins = [
  terser(),
  copyFiles([
    {
      src: "chrome/manifest.json",
      dest: "dist/manifest.json",
      watch: false,
    },
  ]),
];
//https://github.com/jaebradley/example-rollup-library/blob/master/rollup.config.js
const createConfig = (filename) => ({
  input: `chrome/${filename}.js`,
  output: [
    {
      file: `dist/${filename}.js`,
      format: "es",
    },
  ],
  plugins,
});

const configs = ["background"].map((filename) => createConfig(filename));

export default configs;
