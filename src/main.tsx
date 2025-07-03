import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { AuthProvider } from "./contexts/auth-context";
import { RestaurantProvider } from "./contexts/restaurant-context";
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
