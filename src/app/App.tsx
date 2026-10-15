import { RouterProvider } from "react-router-dom";
import { MotionConfig } from "motion/react";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { router } from "./Router";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </MotionConfig>
  );
}
