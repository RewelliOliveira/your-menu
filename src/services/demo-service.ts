import { resetDatabase } from "./mock/db";

export { DEMO_ACCOUNT } from "./mock/seed";

export function resetDemoData() {
  resetDatabase();
  window.location.reload();
}
