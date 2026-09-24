// Browser-Tests (#26, TD-5): laufen gegen das gebaute _site/, ausgeliefert von e2e/server.js. Nur Chromium.
// Lokal: npm run build && npm run test:browser. Ausgaben unter build/ (vom Build und von ESLint ausgenommen).
import { defineConfig, devices } from "@playwright/test";

const PORT = 8813;

export default defineConfig({
  testDir: "e2e",
  testMatch: "*.spec.js",
  outputDir: "build/playwright/ergebnisse",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { outputFolder: "build/playwright/bericht", open: "never" }]] : "list",
  use: { baseURL: `http://127.0.0.1:${PORT}/`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `node e2e/server.js _site`,
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
