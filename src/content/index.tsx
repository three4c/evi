import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
