import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TodoProvider } from "./context/TodoProvider.tsx";
import { NotificationProvider } from "./context/NotificationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </TodoProvider>
  </StrictMode>,
);
