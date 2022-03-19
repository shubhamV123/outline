import path from "path";
import fs from "fs";

const FILES_TO_WATCH = [
  { src: "chrome/background.js", dest: "dist/background.js", watch: true },
  { src: "chrome/manifest.json", dest: "dist/manifest.json", watch: true },
];

const copyFiles = (filesToWatch = FILES_TO_WATCH) => {
  return {
    name: "copy-file",
    load() {
      filesToWatch.forEach((file) => {
        if (file.watch) {
          this.addWatchFile(path.resolve(file.src));
        }
      });
    },
    generateBundle: () => {
      filesToWatch.forEach((file) => {
        fs.copyFileSync(path.resolve(file.src), path.resolve(file.dest));
      });
    },
  };
};

export { copyFiles, FILES_TO_WATCH };
