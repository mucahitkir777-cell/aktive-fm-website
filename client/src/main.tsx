import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { applyAfmBrandTheme } from "./styles/brand";

applyAfmBrandTheme();

createRoot(document.getElementById("root")!).render(<App />);
