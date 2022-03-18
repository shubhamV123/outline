import React from "react";
import ReactDOM from "react-dom";

import SyncProvider from "./Context/Sync";
import App from "./App";

import Header from "./Header";
import Render from "./Render";

import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <SyncProvider>
      <Header />
      <Render />
    </SyncProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
