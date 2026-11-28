import { expect, test, type Locator } from "@playwright/test";

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (box === null) throw new Error("The element is not on screen.");
  return box;
}

// Code run in the page is passed as strings, because these tests run in Node, whose types have no DOM.
// The four screen classes of ADR 0011, at common device sizes.
const desktop = { width: 1440, height: 900 };
const phoneLandscape = { width: 844, height: 390 };
const tablet = { width: 820, height: 1180 };
const phonePortrait = { width: 390, height: 844 };

test.describe("on desktop", () => {
  test.use({ viewport: desktop });

  test("the toolbar holds collapse, Aircraft, Playback, Settings, Share and Full screen in order", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("group", { name: "Toolbar" }))
      .toMatchAriaSnapshot(`
        - button "Hide toolbar"
        - button "Aircraft"
        - button "Playback"
        - button "Settings"
        - button "Share"
        - button "Full screen"
      `);
  });

  test("without a share sheet, Share copies the site link", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await page.getByRole("button", { name: "Share" }).click();

    await expect
      .poll(() => page.evaluate<string>("navigator.clipboard.readText()"))
      .toBe(`${String(baseURL)}/`);
  });

  test("after copying the link, Share says so", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await page.getByRole("button", { name: "Share" }).click();

    await expect(page.getByRole("status")).toHaveText("Link copied");
  });

  test("pressing Full screen fills the screen", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Full screen" }).click();

    await expect
      .poll(() => page.evaluate<boolean>("document.fullscreenElement !== null"))
      .toBe(true);
  });

  test("in full screen, the Full screen icon is lit", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Full screen" }).click();

    await expect(
      page.getByRole("button", { name: "Full screen" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("pressing Settings swaps the Aircraft panel for the Settings panel", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Settings" }).click();

    await expect(page.getByRole("complementary")).toHaveAccessibleName(
      "Settings",
    );
  });

  test("pressing the lit Aircraft icon hides the panel and the profile takes its space", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Aircraft" }).click();

    const profile = await boxOf(
      page.getByRole("img", { name: "Glide profile" }),
    );
    expect(profile.width).toBe(desktop.width);
  });

  test("the playback strip sits under the profile, as wide as the profile", async ({
    page,
  }) => {
    await page.goto("/");

    const profile = await boxOf(
      page.getByRole("img", { name: "Glide profile" }),
    );
    const playback = await boxOf(
      page.getByRole("region", { name: "Playback" }),
    );
    expect(playback).toMatchObject({
      x: profile.x,
      y: profile.y + profile.height,
      width: profile.width,
    });
  });

  test("pressing the lit Playback icon hides the strip and the profile takes its space", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Playback" }).click();

    const profile = await boxOf(
      page.getByRole("img", { name: "Glide profile" }),
    );
    expect(profile.height).toBe(desktop.height);
  });

  test("hiding the toolbar leaves a tab at the right edge of the profile", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Hide toolbar" }).click();

    const profile = await boxOf(
      page.getByRole("img", { name: "Glide profile" }),
    );
    const tab = await boxOf(page.getByRole("button", { name: "Show toolbar" }));
    expect(tab.x + tab.width).toBe(profile.x + profile.width);
  });

  test("the toolbar tab brings the toolbar back", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Hide toolbar" }).click();

    await page.getByRole("button", { name: "Show toolbar" }).click();

    await expect(page.getByRole("group", { name: "Toolbar" })).toBeVisible();
  });

  test("hiding the toolbar by keyboard moves focus to the toolbar tab", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("button", { name: "Show toolbar" }),
    ).toBeFocused();
  });

  test("restoring the toolbar by keyboard moves focus back to Hide toolbar", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.keyboard.press("Space");

    await expect(
      page.getByRole("button", { name: "Hide toolbar" }),
    ).toBeFocused();
  });

  test("a keyboard-focused toolbar button shows an outline in the accent colour", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const hideButton = page.getByRole("button", { name: "Hide toolbar" });
    await expect(hideButton).toHaveCSS("outline-color", "rgb(255, 0, 255)");
  });
});

for (const [screenClass, viewport] of [
  ["desktop", desktop],
  ["phone landscape", phoneLandscape],
] as const) {
  test.describe(`on ${screenClass}`, () => {
    test.use({ viewport });

    test("the open panel docks in a column to the right of the profile", async ({
      page,
    }) => {
      await page.goto("/");

      const profile = await boxOf(
        page.getByRole("img", { name: "Glide profile" }),
      );
      const panel = await boxOf(page.getByRole("complementary"));
      expect(panel.x).toBe(profile.x + profile.width);
    });
  });
}

for (const [screenClass, viewport] of [
  ["tablet", tablet],
  ["phone portrait", phonePortrait],
] as const) {
  test.describe(`on ${screenClass}`, () => {
    test.use({ viewport });

    test("the profile is on top, playback below it, then the panel", async ({
      page,
    }) => {
      await page.goto("/");

      const profile = await boxOf(
        page.getByRole("img", { name: "Glide profile" }),
      );
      const playback = await boxOf(
        page.getByRole("region", { name: "Playback" }),
      );
      const panel = await boxOf(page.getByRole("complementary"));
      expect([playback.y, panel.y]).toEqual([
        profile.y + profile.height,
        playback.y + playback.height,
      ]);
    });
  });
}

test.describe("on phone portrait", () => {
  test.use({ viewport: phonePortrait, hasTouch: true });

  test("the toolbar keeps its first four buttons", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("group", { name: "Toolbar" }))
      .toMatchAriaSnapshot(`
        - group "Toolbar":
          - /children: equal
          - button "Hide toolbar"
          - button "Aircraft"
          - button "Playback"
          - button "Settings"
      `);
  });

  test("the title and toolbar share one row", async ({ page }) => {
    await page.goto("/");

    const title = await boxOf(
      page.getByRole("heading", { name: "Glide Compare" }),
    );
    const toolbar = await boxOf(page.getByRole("group", { name: "Toolbar" }));
    expect(title.y).toBeGreaterThanOrEqual(toolbar.y);
    expect(title.y + title.height).toBeLessThanOrEqual(
      toolbar.y + toolbar.height,
    );
    expect(title.x + title.width).toBeLessThan(toolbar.x);
  });

  test("tapping Settings opens the Settings panel", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Settings" }).tap();

    await expect(page.getByRole("complementary")).toHaveAccessibleName(
      "Settings",
    );
  });

  test("the Settings panel holds Share", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Settings" }).tap();

    await expect(
      page
        .getByRole("complementary", { name: "Settings" })
        .getByRole("button", { name: "Share" }),
    ).toBeVisible();
  });
});

test.describe("on a small phone held upright", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test("the title stays clear of the toolbar", async ({ page }) => {
    await page.goto("/");

    const title = await boxOf(
      page.getByRole("heading", { name: "Glide Compare" }),
    );
    const toolbar = await boxOf(page.getByRole("group", { name: "Toolbar" }));
    expect(title.x + title.width).toBeLessThan(toolbar.x);
  });
});

test.describe("in a browser that cannot go full screen", () => {
  test.use({ viewport: phoneLandscape });

  test("the toolbar leaves out Full screen", async ({ page }) => {
    await page.addInitScript(
      "Object.defineProperty(Document.prototype, 'fullscreenEnabled', { get: () => false })",
    );
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Full screen" })).toHaveCount(
      0,
    );
  });
});

test.describe("on a short phone in landscape", () => {
  test.use({ viewport: { width: 568, height: 320 } });

  test("the open panel docks in a column to the right of the profile", async ({
    page,
  }) => {
    await page.goto("/");

    const profile = await boxOf(
      page.getByRole("img", { name: "Glide profile" }),
    );
    const panel = await boxOf(page.getByRole("complementary"));
    expect(panel.x).toBe(profile.x + profile.width);
  });
});
