export const env = {
  apiUrl: (import.meta.env.VITE_API_URL ?? "http://localhost:3333/api").replace(/\/$/, ""),
  demoEmail: import.meta.env.VITE_DEMO_EMAIL ?? "",
  demoPassword: import.meta.env.VITE_DEMO_PASSWORD ?? "",
  demoSlug: import.meta.env.VITE_DEMO_SLUG ?? "",
};

export const demoAccount = env.demoEmail && env.demoPassword ? { email: env.demoEmail, password: env.demoPassword } : null;
