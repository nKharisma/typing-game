import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeAndLanguagesProvider } from "./contexts/ThemeAndLangaugesProvider";
import createRouter from "./Router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeAndLanguagesProvider>
        <RouterProvider router={createRouter()} />
      </ThemeAndLanguagesProvider>
    </AuthProvider>
  </React.StrictMode>,
);
