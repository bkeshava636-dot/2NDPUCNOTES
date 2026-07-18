import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setAdminTokenGetter } from "@workspace/api-client-react";
import { getAdminToken } from "./lib/utils";

setAdminTokenGetter(() => getAdminToken());

createRoot(document.getElementById("root")!).render(<App />);
