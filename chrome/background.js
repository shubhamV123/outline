async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getStore() {
  const items = await chrome.storage.sync.get("store");
  return items;
}

const getUrlInfo = (url) => {
  const { pathname, hostname } = new URL(url);
  return { pathname, hostname };
};

const getBadgeLength = ({ store, hostname, pathname }) => {
  return (
    store[hostname][pathname]?.content?.filter((data) => data.insert !== "\n")
      ?.length || 0
  );
};

const CONTEXT_MENU_CONTENTS = {
  forSelection: ["Selection context menu"],
};

function setUpContextMenus() {
  CONTEXT_MENU_CONTENTS.forSelection.forEach(function (commandId) {
    chrome.contextMenus.create({
      title: "Add to my outline",
      id: commandId,
      contexts: ["selection"],
    });
  });
}

const updateBadgeText = (length) => {
  chrome.action.setBadgeText({ text: String(length) });
};

chrome.runtime.onInstalled.addListener(function () {
  // When the app gets installed, set up the context menus
  setUpContextMenus();
});

chrome.contextMenus.onClicked.addListener(async function (itemData) {
  const { pathname, hostname } = new URL(itemData.pageUrl);
  const currentTab = await getCurrentTab();
  /**
   * Save current text in quill delta format
   */
  const selectionText = [
    { insert: itemData.selectionText },
    {
      insert: "\n",
      attributes: {
        list: "bullet",
      },
    },
  ];

  let currentPageNotesLength = 0;
  let store;
  chrome.storage.sync.get(null, function (items) {
    /**
     * check if specific page exist
     */
    if (!items.store || !items?.store?.[hostname]) {
      store = {
        ...items.store,
        [hostname]: {
          [pathname]: {
            title: currentTab.title,
            content: [...selectionText],
            hostname,
            pathname,
          },
        },
      };
    } else {
      const allUrlSpecificData = items.store[hostname];
      const specificPageData = allUrlSpecificData[pathname];
      //Else update availabe page data
      store = {
        ...items.store,
        [hostname]: {
          ...allUrlSpecificData,
          [pathname]: {
            ...specificPageData,
            title: currentTab.title,
            content: specificPageData?.content
              ? [...specificPageData?.content, ...selectionText]
              : [...selectionText],
          },
        },
      };
    }

    chrome.storage.sync.set({ store }, function () {
      /**
       * Enabled this when badge bug fixed
       */
      // currentPageNotesLength = getBadgeLength({ store, hostname, pathname });
      // updateBadgeText(currentPageNotesLength);
    });
  });
});

// Badge text on tab switch
// @TODO: Badge does not reset if its updated on other. Need to fix then enable this
// chrome.tabs.onActivated.addListener(async function (tabId, changeInfo, tab) {
//   const { store } = await getStore();
//   const { url } = await getCurrentTab();
//   const { pathname, hostname } = getUrlInfo(url);
//   const badgeLength = getBadgeLength({ store, hostname, pathname });
//   updateBadgeText(badgeLength);
//   // chrome.tabs.sendMessage("DOMInfo", (response) => {
//   //   // 3. Got an asynchronous response with the data from the background
//   //   console.log("received user data", response);
//   // });
// });
