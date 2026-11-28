import { expect, test } from "@playwright/test";

test("the built site shows the labelled profile canvas", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("img", { name: "Glide profile" })).toBeVisible();
});
