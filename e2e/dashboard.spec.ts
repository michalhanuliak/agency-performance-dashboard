import { test, expect } from "@playwright/test";

const DEFAULT_WIDGETS = [
  { id: "avg-response", col_span: 1, visible: true },
  { id: "avg-call-answer", col_span: 1, visible: true },
  { id: "total-incidents", col_span: 1, visible: true },
  { id: "critical-incidents", col_span: 1, visible: true },
  { id: "response-by-type", col_span: 2, visible: true },
  { id: "severity-breakdown", col_span: 2, visible: true },
  { id: "recent-incidents", col_span: 1, visible: true },
  { id: "incidents-over-time", col_span: 2, visible: true },
  { id: "incidents-table", col_span: 4, visible: true },
];

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Reset dashboard config to default state before each test
    await page.request.put("http://localhost:8000/dashboard/config", {
      data: { widgets: DEFAULT_WIDGETS },
    });
    await page.goto("/");
    // Wait for at least one widget to finish loading (KPI cards load fastest)
    await page.locator('[data-slot="card-title"]').first().waitFor();
  });

  test("page loads with TopBar", async ({ page }) => {
    await expect(
      page.getByText("Metro 911 Command Center")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Edit Dashboard" })
    ).toBeVisible();
  });

  test("KPI cards display data", async ({ page }) => {
    // Use card-title data-slot for precise text matching
    for (const title of [
      "Avg Response Time",
      "Avg Call Answer Time",
      "Total Incidents",
      "Critical Incidents",
    ]) {
      await expect(
        page.locator('[data-slot="card-title"]', { hasText: title }).first()
      ).toBeVisible();
    }

    // Verify known values — scope to the card containing the exact title
    const totalCard = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Total Incidents" }),
    });
    await expect(totalCard.getByText("100")).toBeVisible();

    const criticalCard = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Critical Incidents" }),
    });
    await expect(criticalCard.getByText("25")).toBeVisible();
  });

  test("bar chart renders", async ({ page }) => {
    const widget = page.locator('[data-slot="card"]', {
      hasText: "Avg Response Time by Type",
    });
    await expect(widget).toBeVisible();

    // Recharts renders SVG with .recharts-bar-rectangle elements
    await expect(widget.locator(".recharts-bar-rectangle").first()).toBeVisible();
  });

  test("severity donut chart renders", async ({ page }) => {
    const widget = page.locator('[data-slot="card"]', {
      hasText: "Severity Breakdown",
    });
    await expect(widget).toBeVisible();

    // Check legend items
    for (const severity of ["Critical", "High", "Medium", "Low"]) {
      await expect(widget.getByText(severity)).toBeVisible();
    }

    // Recharts pie renders SVG sectors
    await expect(widget.locator(".recharts-pie-sector").first()).toBeVisible();
  });

  test("recent incidents feed shows entries", async ({ page }) => {
    const widget = page.locator('[data-slot="card"]', {
      hasText: "Recent Incidents",
    });
    await expect(widget).toBeVisible();

    // Feed should have severity badges (at least one)
    await expect(
      widget.getByText(/Critical|High|Medium|Low/).first()
    ).toBeVisible();
  });

  test("incidents over time chart renders", async ({ page }) => {
    const widget = page.locator('[data-slot="card"]', {
      hasText: "Incidents Over Time",
    });
    await expect(widget).toBeVisible();

    // Recharts area renders an SVG path
    await expect(widget.locator(".recharts-area-area").first()).toBeVisible();
  });

  test("data table renders with rows", async ({ page }) => {
    const table = page.locator('[data-slot="table"]');
    await expect(table).toBeVisible();

    // Check column headers
    for (const header of ["Time", "Type", "Severity", "Response", "Answer", "Summary"]) {
      await expect(
        page.locator('[data-slot="table-head"]', { hasText: header })
      ).toBeVisible();
    }

    // Table should have multiple data rows
    const rows = page.locator('[data-slot="table-body"] [data-slot="table-row"]');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(5);
  });

  test("edit mode toggle works", async ({ page }) => {
    const editBtn = page.getByRole("button", { name: "Edit Dashboard" });
    await editBtn.click();

    // Save & Exit and Discard buttons appear
    await expect(
      page.getByRole("button", { name: "Save & Exit" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Discard" })
    ).toBeVisible();

    // Size radios appear in widgets (new sizing system)
    await expect(page.getByRole("radio", { name: "Resize to 1×1" }).first()).toBeVisible();

    // "Add Widgets" button appears
    await expect(page.getByRole("button", { name: "Add Widgets" })).toBeVisible();

    // Discard to exit edit mode
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(
      page.getByRole("button", { name: "Edit Dashboard" })
    ).toBeVisible();

    // Size radios disappear
    await expect(page.getByRole("radio", { name: "Resize to 1×1" }).first()).toBeHidden();
  });

  test("type filter on table works", async ({ page }) => {
    const rows = page.locator('[data-slot="table-body"] [data-slot="table-row"]');

    // Wait for table to load
    await expect(rows.first()).toBeVisible();

    // Click "Fire" tab — wait for the page info to update (indicates filtered data loaded)
    await page.getByRole("tab", { name: "Fire" }).click();
    await expect(page.getByText(/Page 1 of [1-2]/)).toBeVisible({ timeout: 10000 });

    // All visible rows should contain "Fire"
    const fireRowCount = await rows.count();
    for (let i = 0; i < Math.min(fireRowCount, 5); i++) {
      await expect(rows.nth(i)).toContainText("Fire");
    }

    // Click "All" to reset — wait for page count to increase
    await page.getByRole("tab", { name: "All" }).click();
    await expect(page.getByText("Page 1 of 5")).toBeVisible({ timeout: 10000 });
  });

  test("size toggle changes active button and grid classes", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    const widget = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Avg Response Time" }),
    }).first();

    const btn1x1 = widget.getByRole("radio", { name: "Resize to 1×1" });
    const btn2x1 = widget.getByRole("radio", { name: "Resize to 2×1" });
    const btnFull = widget.getByRole("radio", { name: "Resize to Full" });

    // Default is 1×1 (active)
    await expect(btn1x1).toBeChecked();
    await expect(btn2x1).not.toBeChecked();

    // Click 2×1 — becomes active, wrapper gets col-span-2
    await btn2x1.click();
    await expect(btn2x1).toBeChecked();
    await expect(btn1x1).not.toBeChecked();

    const wrapper = widget.locator("..");
    await expect(wrapper).toHaveClass(/col-span-2/);

    // Click Full — col-span-4
    await btnFull.click();
    await expect(btnFull).toBeChecked();
    await expect(wrapper).toHaveClass(/col-span-4/);

    // Click 1×1 to reset
    await btn1x1.click();
    await expect(btn1x1).toBeChecked();
  });

  test("sizes work independently per widget", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    const firstWidget = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Avg Response Time" }),
    }).first();
    await firstWidget.getByRole("radio", { name: "Resize to 2×1" }).click();

    const secondWidget = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Avg Call Answer Time" }),
    });
    await secondWidget.getByRole("radio", { name: "Resize to Full" }).click();

    await expect(firstWidget.getByRole("radio", { name: "Resize to 2×1" })).toBeChecked();
    await expect(firstWidget.getByRole("radio", { name: "Resize to 1×1" })).not.toBeChecked();
    await expect(secondWidget.getByRole("radio", { name: "Resize to Full" })).toBeChecked();
    await expect(secondWidget.getByRole("radio", { name: "Resize to 1×1" })).not.toBeChecked();
  });

  test("drag handles appear only in edit mode", async ({ page }) => {
    // No drag handles in view mode
    await expect(page.getByTestId("drag-handle").first()).toBeHidden();

    // Enter edit mode
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    // Drag handles visible
    const handles = page.getByTestId("drag-handle");
    await expect(handles.first()).toBeVisible();
    expect(await handles.count()).toBeGreaterThan(0);

    // Exit edit mode — handles disappear
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(page.getByTestId("drag-handle").first()).toBeHidden();
  });

  test("drag and drop reorders widgets", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    // Get all widget titles in order before drag
    const titles = page.locator('[data-slot="card-title"]');
    const titlesBefore = await titles.allTextContents();

    // Drag the first widget's handle toward the third widget's handle
    const firstHandle = page.getByTestId("drag-handle").first();
    const thirdHandle = page.getByTestId("drag-handle").nth(2);

    const firstBox = await firstHandle.boundingBox();
    const thirdBox = await thirdHandle.boundingBox();

    if (firstBox && thirdBox) {
      await page.mouse.move(
        firstBox.x + firstBox.width / 2,
        firstBox.y + firstBox.height / 2
      );
      await page.mouse.down();
      // Move in steps to trigger dnd-kit's pointer sensor
      await page.mouse.move(
        thirdBox.x + thirdBox.width / 2,
        thirdBox.y + thirdBox.height / 2,
        { steps: 15 }
      );
      await page.mouse.up();

      // After drag, widget order should have changed
      const titlesAfter = await titles.allTextContents();
      expect(titlesAfter).not.toEqual(titlesBefore);
    }
  });

  test("delete widget removes it from grid", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    // Use "Total Incidents" — unique title, no substring collisions
    const title = page.locator('[data-slot="card-title"]', { hasText: "Total Incidents" });
    await expect(title).toBeVisible();

    const widget = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Total Incidents" }),
    });
    await widget.getByTestId("widget-delete").click();

    // Widget should be gone from the grid
    await expect(title).toBeHidden();
  });

  test("sidebar shows hidden widgets and re-adds them", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();

    // Delete a widget
    const widget = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', { hasText: "Avg Response Time" }),
    }).first();
    await widget.getByTestId("widget-delete").click();

    // Open sidebar
    await page.getByRole("button", { name: "Add Widgets" }).click();
    await expect(page.getByTestId("widget-sidebar")).toBeVisible();

    // Sidebar shows the deleted widget
    await expect(page.getByTestId("widget-sidebar").getByText("Avg Response Time")).toBeVisible();

    // Click "Add" to restore it
    await page.getByTestId("widget-sidebar").getByRole("button", { name: "Add" }).click();

    // Widget is back in the grid
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Avg Response Time" }).first()
    ).toBeVisible();
  });

  test("sidebar shows 'All widgets active' when none hidden", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Dashboard" }).click();
    await page.getByRole("button", { name: "Add Widgets" }).click();

    await expect(page.getByTestId("widget-sidebar")).toBeVisible();
    await expect(page.getByText("All widgets active")).toBeVisible();
  });

  test("theme toggle switches between dark and light", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/light/);

    await page.getByLabel("Switch to light mode").click();
    await expect(html).toHaveClass(/light/);

    await page.getByLabel("Switch to dark mode").click();
    await expect(html).not.toHaveClass(/light/);
  });
});
