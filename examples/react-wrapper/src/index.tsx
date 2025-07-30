import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  // Show loading state
  rootElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center;">
        <h2>Loading Accend Link SDK...</h2>
      </div>
    </div>
  `;

  // Load SDK and render app
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
