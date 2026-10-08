import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { AuthProvider } from "./app/contexts/AuthContext";
import { RestaurantProvider } from "./app/contexts/RestaurantContext";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RestaurantProvider>
        <App />
      </RestaurantProvider>
    </AuthProvider>
  </StrictMode>
);
