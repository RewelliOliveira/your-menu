import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/features/theme/theme-context";

function Toaster(props: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-center"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: "!rounded-2xl !font-sans" } }}
      {...props}
    />
  );
}

export { Toaster };
