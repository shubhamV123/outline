import { useEffect, useState, useRef, useContext } from "react";

import { SyncContext } from "./Context/Sync";

import { debounce, getCurrentTab, getCurrentTabStatus, emitter } from "./utils";
import initQuillEditor from "./initQuill";

import "./App.scss";

function App({ type }) {
  const { tabInfo, activeContent, setActiveContent } = useContext(SyncContext);
  let quillRef = useRef(null);
  let quill = null;
  useEffect(() => {
    quillRef.current = initQuillEditor(
      document.getElementById("editor-container")
    );
    quill = quillRef.current;
    quill.on("text-change", onChange);
    if (type === "new-editor" && false) {
      quill.setContents([]);
    } else if (activeContent?.content) {
      let pushTitle = [];

      // If there is no title exist append title as heading or if it is active content
      if (!activeContent?.isChanged || activeContent?.content?.length === 0) {
        pushTitle = [
          {
            insert: activeContent?.title ?? "",
          },
          {
            insert: "\n",
            attributes: {
              header: 2,
            },
          },
        ];
      }

      quill.setContents([]);
      quill.updateContents([...pushTitle, ...activeContent?.content]);
    }

    return () => {
      if (quill) {
        quill.off("text-change", onChange);
      }
    };
  }, [type, activeContent]);

  const copyContentFromEditor = ({ onSuccess }) => {
    if (quillRef.current) {
      const type = "text/html";
      const blob = new Blob([quillRef.current.root.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];

      navigator.clipboard.write(data).then(
        function () {
          onSuccess();
        },
        /* failure */
        function (error) {
          console.error("Unable to write to clipboard. :-(");
        }
      );
    }
  };

  useEffect(() => {
    emitter.on("copy-current", copyContentFromEditor);

    return () => {
      emitter.off("copy-current", copyContentFromEditor);
    };
  }, [copyContentFromEditor, quill]);

  const onChange = debounce(function (deltaChange, oldDelta, source) {
    if (source === "user") {
      chrome.storage.sync.get("store", async (items) => {
        const { store } = items;
        const { pathname, hostname, title } = await getCurrentTabStatus();

        /**
         * Get current page info.
         * There can be a case user can update current page text as well as any other page content
         * on any other page.
         * This check will ensure we update data to correct state
         */
        const pageHostName = activeContent?.hostname ?? hostname;
        const pagePathName = activeContent?.pathname ?? pathname;
        const allUrlSpecificData = store?.[pageHostName];

        const specificPageData = allUrlSpecificData?.[pagePathName];
        const pageTitle = allUrlSpecificData?.[pagePathName]?.title;

        const newStore = {
          ...store,
          [pageHostName]: {
            ...allUrlSpecificData,
            [pagePathName]: {
              ...specificPageData,
              isChanged: true,
              hostname: pageHostName,
              pathname: pagePathName,
              ...(!pageTitle && { title }),
              content: [...quillRef.current.editor.getDelta().ops],
            },
          },
        };

        chrome.storage.sync.set({ store: newStore }, function (items) {
          console.log("Success");
        });
      });
    }
  }, 200);
  return (
    <div className="App">
      <div id="editor-container"></div>
    </div>
  );
}

export default App;
