import { useCallback, useContext, useEffect, useState } from "react";

import { SyncContext } from "./Context/Sync";
import { emitter } from "./utils";
import { TOOLTIP_TIMEOUT } from "./constants";

import GithubIcon from "./icons/github";
import CopyIcon from "./icons/copy";

import "./header.scss";

const Header = () => {
  //Copy notification
  const [showTooltip, setShowTooltip] = useState(false);

  const { updateActiveView, activeView, activeContent } =
    useContext(SyncContext);

  const isListButtonDisabled = activeView === "list";
  const isEditorButtonDisabled = activeView === "new-editor";
  const isPostEditor = activeView === "post-editor";

  let timer;
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const openInNewTab = useCallback(() => {
    const newWindow = window.open(
      "https://github.com/shubhamV123/outline",
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  }, []);
  const showNotification = useCallback(() => {
    setShowTooltip(true);
    let timer = setTimeout(() => {
      setShowTooltip(false);
    }, TOOLTIP_TIMEOUT);
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-space-between header-button-container">
      {(!isPostEditor || activeContent) && (
        <button
          disabled={isEditorButtonDisabled}
          className={`button button__editor ${
            isEditorButtonDisabled ? "button--disabled" : ""
          }`}
          onClick={() => updateActiveView("new-editor")}
        >
          Current Tab Editor
        </button>
      )}
      <div className="d-flex align-items-center">
        <button
          className={`button button__post ${
            isListButtonDisabled ? "button--disabled" : ""
          }`}
          disabled={isListButtonDisabled}
          onClick={() => updateActiveView("list")}
        >
          View all post
        </button>
        <GithubIcon className="cp" onClick={openInNewTab} />
        {!isListButtonDisabled && (
          <>
            {activeContent?.content?.length > 0 && (
              <CopyIcon
                className="cp"
                onClick={() =>
                  emitter.emit("copy-current", { onSuccess: showNotification })
                }
              />
            )}
            {showTooltip && (
              <div className="copy-container copy-container__tooltip-text">
                Copied to clipboard
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Header;
