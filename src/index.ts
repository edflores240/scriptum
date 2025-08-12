import React from "react";
import ReactDOM from "react-dom/client";
import { Editor } from "./Editor";

function init(containerSelector: string) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(`Container ${containerSelector} not found`);
  }

  // Render React Editor into container
  const root = ReactDOM.createRoot(container);
  root.render(<Editor />);
}

// Export the init so it's available in global UMD namespace
export { init };
