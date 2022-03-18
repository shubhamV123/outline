import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useLayoutEffect,
} from "react";
import omit from "lodash.omit";
import {
  getCurrentTab,
  getUrlInfo,
  getCurrentTabStatus,
  getStore,
} from "../utils";

import { STORE_DATA_KEY } from "../constants";

const useSyncContext = () => {
  const [isQuillInit, setIsQuillInit] = useState(false);
  const [store, setActiveStore] = useState({});

  const [tabInfo, setTabInfo] = useState();
  const [activeContent, setActiveContent] = useState(null);
  const [activeView, setActiveView] = useState("new-editor");
  const isCurrentPageEditor = activeView === "new-editor";
  const editor = useRef(null);

  const containerId = document.getElementById("editor-container");

  const updateActiveView = useCallback((val) => {
    setActiveView(val);
  }, []);

  const resetAll = () => {
    setTabInfo();
    setActiveContent(null);
  };

  const updatedListItem = async (e) => {
    const postInfo = e.target.closest("li");
    const url = postInfo.getAttribute("data-url");
    const post = postInfo.getAttribute("data-post");
    const isDeleted =
      e?.target?.closest("span")?.getAttribute("data-action") === "delete";
    const items = await getStore();
    if (isDeleted) {
      //If its deleted remove specific url from the hostname and update in store
      const bookMarks =
        Object.keys(items.store?.[url]).length > 1
          ? {
              ...items.store,
              [url]: {
                ...omit(items.store?.[url], post),
              },
            }
          : {
              ...omit(items.store, url),
            };
      const mynewData = bookMarks;

      chrome.storage.sync.set({ store: mynewData }, function (items) {});
    } else {
      // const editorType
      const speicificPost = items?.store?.[url]?.[post];

      if (url && post && speicificPost) {
        setActiveView("post-editor");
        setActiveContent(speicificPost);
      }
    }
  };

  useEffect(() => {
    try {
      chrome.storage.sync.get(null, async (items) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          return chrome.runtime.lastError;
        }
        // Pass the data retrieved from storage down the promise chain.
        const { pathname, hostname, url, title } = await getCurrentTabStatus();
        setActiveStore(items?.store);
        setActiveContent(
          items?.store?.[hostname]?.[pathname] || { title: "", content: [] }
        );
        const allUrlSpecificData = items?.store?.[hostname];
        const specificPageData = allUrlSpecificData?.[pathname];
        const pageTitle = allUrlSpecificData?.[pathname]?.title;

        if (!items?.store?.[hostname]?.[pathname] && !isCurrentPageEditor) {
          setActiveView("list");
        }
        setTabInfo({ pathname, hostname, url, title });
      });
    } catch (e) {}
  }, [isCurrentPageEditor]);

  return {
    isQuillInit,
    tabInfo,
    activeContent,
    updateActiveView,
    activeView,
    updatedListItem,
    setActiveContent,
  };
};

export default useSyncContext;
