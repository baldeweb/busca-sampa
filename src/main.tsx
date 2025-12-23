import React from "react";
import './i18n';
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./web/app/routes";
import "./index.css";
import { GlobalErrorBoundary } from "@/web/components/layout/GlobalErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  </React.StrictMode>
);