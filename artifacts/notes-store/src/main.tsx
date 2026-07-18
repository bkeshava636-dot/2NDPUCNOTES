import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  setAdminTokenGetter,
  setBaseUrl,
} from "@workspace/api-client-react";

import { getAdminToken } from "./lib/utils";

setBaseUrl(import.meta.env.VITE_API_URL);

setAdminTokenGetter(() => getAdminToken());

createRoot(document.getElementById("root")!).render(<App />);