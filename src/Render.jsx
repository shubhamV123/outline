import { useContext, useLayoutEffect } from "react";

import { SyncContext } from "./Context/Sync";
import App from "./App";
import Input from "./Input";
import List from "./List";
const Render = () => {
  const { updateActiveView, activeView } = useContext(SyncContext);
  useLayoutEffect(() => {
    if (activeView.includes("list")) {
      document.body.style.backgroundColor = "#e7eef7";
    } else {
      document.body.style.backgroundColor = "#fff";
    }
  }, [activeView]);
  switch (activeView) {
    case "new-editor":
      return <App type="new-editor" />;
      break;
    case "post-editor":
      return <App type="post-editor" />;
      break;
    case "list":
      return <List />;
  }
};
export default Render;
