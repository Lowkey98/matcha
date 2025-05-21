import routeConfig from "./routeConfig";
import "./index.css";

import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(routeConfig);

const domNode = document.getElementById("root");

if (!domNode) {
  throw new Error("Root element not found!");
}

const root = createRoot(domNode);
root.render(<RouterProvider router={router} />);
