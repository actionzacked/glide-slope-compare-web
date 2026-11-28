import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProfileCanvas } from "./components/ProfileCanvas";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("index.html is missing the #root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <main>
      <ProfileCanvas />
    </main>
  </StrictMode>,
);
