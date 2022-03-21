import React from "react";
import ReactDOM from "react-dom";

import SyncProvider from "./Context/Sync";
import App from "./App";
import ErrorBoundary from "./Errorboundary";

import Header from "./Header";
import Render from "./Render";

import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SyncProvider>
        <Header />
        <Render />
      </SyncProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
