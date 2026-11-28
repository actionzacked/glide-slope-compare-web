import { describe, expect, test } from "vitest";
import { buildScene } from "./buildScene";

// The profile leaves 64 px on the left for altitude labels, 16 px on the right,
// 64 px at the top for the title and toolbar, and 32 px below the ground.
// A 1,080 px wide canvas therefore has a 1,000 px wide plot.

const exampleGlide = {
  name: "Example 9:1",
  startAltitudeFt: 3000,
  glideDistanceFt: 27_000,
};

describe("scene for one glide on flat terrain", () => {
  test("starts the glide at its starting altitude on the left edge of the plot", () => {
    // Tall enough for 6×: 1,000 px plot ÷ (27,000 × 1.05 ft) = 0.035273 px/ft across, × 6 = 0.211640 px/ft up.
    // The ground is at 1,000 − 32 = 968 px, so 3,000 ft is 968 − 3,000 × 0.211640 = 333.08 px.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.glides[0]?.startPx.x).toBeCloseTo(64, 2);
    expect(scene.glides[0]?.startPx.y).toBeCloseTo(333.08, 2);
  });

  test("ends the longest glide on the ground with 5% of the plot width to spare", () => {
    // 64 + 27,000 ÷ (27,000 × 1.05) × 1,000 = 64 + 952.38 = 1,016.38 px; ground at 968 px.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.glides[0]?.endPx.x).toBeCloseTo(1016.38, 2);
    expect(scene.glides[0]?.endPx.y).toBeCloseTo(968, 2);
  });

  test("draws the ground 32 px above the bottom of the profile", () => {
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.groundYPx).toBe(968);
  });

  test("exaggerates heights 6× when the profile is tall enough", () => {
    // At 6×, 3,000 ft takes 634.92 px, which fits the 968 − 64 = 904 px between the ground and the top band.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.verticalExaggeration).toBeCloseTo(6, 4);
  });

  test("shrinks the exaggeration so the starting altitude fits a short profile", () => {
    // 468 − 64 = 404 px for 3,000 ft is 0.134667 px/ft up; ÷ 0.035273 px/ft across = 3.8178×.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 500,
      glides: [exampleGlide],
    });
    expect(scene.verticalExaggeration).toBeCloseTo(3.8178, 4);
  });

  test("starts the glide just below the title and toolbar band when the profile is short", () => {
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 500,
      glides: [exampleGlide],
    });
    expect(scene.glides[0]?.startPx.y).toBeCloseTo(64, 2);
  });

  test("names the glide on the ground just below its touchdown point, clear of the line", () => {
    // The name's right end sits at the touchdown, 1,016.38 px, 8 px below the 968 px ground.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.glides[0]?.nameLabel).toEqual({
      text: "Example 9:1",
      xPx: expect.closeTo(1016.38, 2) as number,
      yPx: 976,
    });
  });
});

describe("altitude grid", () => {
  test("runs grid lines 1,000 ft apart up to the top of the profile", () => {
    // At 0.211640 px/ft, the 968 px above the ground hold 4,573.8 ft: 500 ft steps would need 10 lines, so 1,000 ft.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.altitudeGridLines.map((line) => line.altitudeFt)).toEqual([
      0, 1000, 2000, 3000, 4000,
    ]);
  });

  test("places each grid line at its altitude", () => {
    // 968 − 4,000 × 0.211640 = 121.44 px
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [exampleGlide],
    });
    expect(scene.altitudeGridLines[4]?.yPx).toBeCloseTo(121.44, 2);
  });

  test("runs grid lines 500 ft apart for a glide from 1,000 ft", () => {
    // 1,000 px ÷ 10,500 ft × 6 = 0.571429 px/ft, so 968 px hold 1,694 ft: 250 ft steps would need 7 lines.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 1000,
      glides: [{ name: "Low", startAltitudeFt: 1000, glideDistanceFt: 10_000 }],
    });
    expect(scene.altitudeGridLines.map((line) => line.altitudeFt)).toEqual([
      0, 500, 1000, 1500,
    ]);
  });

  test("labels grid lines in feet, leaving out any label that would reach the title and toolbar band", () => {
    // Short profile: the 3,000 ft line sits at 64 px, the band's edge, so a 20 px tall label there would reach into it.
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 500,
      glides: [exampleGlide],
    });
    expect(scene.altitudeLabels.map((label) => label.text)).toEqual([
      "0 ft",
      "1,000 ft",
      "2,000 ft",
    ]);
  });

  test("puts each altitude label just left of the plot, level with its grid line", () => {
    // 1,000 ft on the short profile: 468 − 1,000 × 0.134667 = 333.33 px
    const scene = buildScene({
      widthPx: 1080,
      heightPx: 500,
      glides: [exampleGlide],
    });
    expect(scene.altitudeLabels[1]?.xPx).toBe(56);
    expect(scene.altitudeLabels[1]?.yPx).toBeCloseTo(333.33, 2);
  });
});
