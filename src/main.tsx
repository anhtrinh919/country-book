import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

/* Prompt the user to reload when a new version is available */
registerSW({
  onNeedRefresh() {
    if (confirm("A new version of the book is available. Reload to update?")) {
      window.location.reload();
    }
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
