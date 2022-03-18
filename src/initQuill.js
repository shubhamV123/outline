import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import "highlight.js/styles/base16/rebecca.css";
//Register language
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);

import Quill from "quill";

window.hljs = hljs;

const DEFAULT_OPTIONS = {
  theme: "bubble",

  modules: {
    history: {
      // Enable with custom configurations
      delay: 2500,
      userOnly: true,
    },
    syntax: {
      highlight: (function () {
        if (window.hljs == null) return null;
        return function (text) {
          let result = window.hljs.highlightAuto(text);
          return result.value;
        };
      })(),
    },
    toolbar: [
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
      ["code-block"],
    ],
    clipboard: {
      matchVisual: false,
    },
  },
};

const initQuillEditor = (element, options = DEFAULT_OPTIONS) => {
  return new Quill(element, options);
};

export default initQuillEditor;
