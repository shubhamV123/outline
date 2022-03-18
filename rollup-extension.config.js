import { terser } from "rollup-plugin-terser";

const plugins = [terser()]; //terser(), nodeResolve()
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
