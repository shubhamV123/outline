import { createContext, useEffect, useState, useRef } from "react";
import useSyncContext from "../hooks/useSyncContext";

export const SyncContext = createContext(null);

const SyncProvider = ({ children }) => {
  const {
    isQuillInit,
    tabInfo,
    quill,
    activeContent,
    updateActiveView,
    activeView,
    updatedListItem,
    setActiveContent,
  } = useSyncContext();

  return (
    <SyncContext.Provider
      value={{
        tabInfo,
        activeContent,
        quill,
        isQuillInit,
        updateActiveView,
        activeView,
        updatedListItem,
        setActiveContent,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export default SyncProvider;
