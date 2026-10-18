import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
  webServer: [
    {
      command: "cd api && python3 -m uvicorn app.main:app --reload --port 8000",
      port: 8000,
      reuseExistingServer: true,
      timeout: 15_000,
    },
    {
      command: "cd frontend && npm run dev",
      port: 5173,
      reuseExistingServer: true,
      timeout: 15_000,
    },
  ],
});
