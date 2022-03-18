import mitt from "mitt";

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getStore(key = "store") {
  const items = await chrome.storage.sync.get(key);
  return items;
}

const getUrlInfo = (url) => {
  const { pathname, hostname } = new URL(url);
  return { pathname, hostname };
};

const getCurrentTabStatus = async () => {
  const { status, url, title } = await getCurrentTab();
  const { hostname, pathname } = getUrlInfo(url);
  return { status, url, hostname, pathname, title };
};

const debounce = (fn, timeout) => {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
      clearTimeout(timer);
    }, timeout);
  };
};

const emitter = mitt();

export {
  getCurrentTab,
  getStore,
  getUrlInfo,
  debounce,
  getCurrentTabStatus,
  emitter,
};
