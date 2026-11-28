import { expect, test } from "@playwright/test";

test("the built site shows the labelled profile canvas", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("img", { name: "Glide profile" })).toBeVisible();
});

test("the aircraft panel shows the example aircraft's glide numbers", async ({
  page,
}) => {
  await page.goto("/");

  const panel = page.getByRole("complementary", { name: "Aircraft" });
  await expect(
    panel.getByRole("heading", { name: "Example 9:1" }),
  ).toBeVisible();
  await expect(panel).toContainText("4.4 NM");
  await expect(panel).toContainText("4 min 6 s");
  await expect(panel).toContainText("731 fpm");
});
