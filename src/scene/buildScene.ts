// The top margin keeps the glide and its labels clear of the title and toolbar.
const margin = { leftPx: 64, rightPx: 16, topPx: 64, bottomPx: 32 };
// ADR 0011: the longest glide fills the width plus 5%, at up to 6× vertical exaggeration.
const widthBuffer = 1.05;
const maxVerticalExaggeration = 6;
const altitudeGridStepsFt = [100, 250, 500, 1000, 2500, 5000, 10_000];
const maxAltitudeGridSteps = 6;
const altitudeLabelHalfHeightPx = 10;
const labelGapPx = 8;

export interface Glide {
  name: string;
  startAltitudeFt: number;
  glideDistanceFt: number;
}

interface SceneInput {
  widthPx: number;
  heightPx: number;
  glides: Glide[];
}

export function buildScene({ widthPx, heightPx, glides }: SceneInput) {
  const groundYPx = heightPx - margin.bottomPx;
  const longestGlideFt = Math.max(...glides.map((g) => g.glideDistanceFt));
  const highestStartFt = Math.max(...glides.map((g) => g.startAltitudeFt));
  const pxPerFtAcross =
    (widthPx - margin.leftPx - margin.rightPx) / (longestGlideFt * widthBuffer);
  const pxPerFtUp = Math.min(
    pxPerFtAcross * maxVerticalExaggeration,
    (groundYPx - margin.topPx) / highestStartFt,
  );

  const toPx = (distanceFt: number, altitudeFt: number) => ({
    x: margin.leftPx + distanceFt * pxPerFtAcross,
    y: groundYPx - altitudeFt * pxPerFtUp,
  });

  const profileHeightFt = groundYPx / pxPerFtUp;
  const gridStepFt =
    altitudeGridStepsFt.find(
      (stepFt) => profileHeightFt / stepFt <= maxAltitudeGridSteps,
    ) ?? Math.max(...altitudeGridStepsFt);
  const altitudeGridLines = [];
  for (
    let altitudeFt = 0;
    altitudeFt <= profileHeightFt;
    altitudeFt += gridStepFt
  ) {
    altitudeGridLines.push({ altitudeFt, yPx: toPx(0, altitudeFt).y });
  }

  return {
    plotLeftPx: margin.leftPx,
    groundYPx,
    altitudeGridLines,
    altitudeLabels: altitudeGridLines
      .filter((line) => line.yPx - altitudeLabelHalfHeightPx >= margin.topPx)
      .map((line) => ({
        text: `${line.altitudeFt.toLocaleString("en-US")} ft`,
        xPx: margin.leftPx - labelGapPx,
        yPx: line.yPx,
      })),
    verticalExaggeration: pxPerFtUp / pxPerFtAcross,
    glides: glides.map((g) => {
      const endPx = toPx(g.glideDistanceFt, 0);
      return {
        startPx: toPx(0, g.startAltitudeFt),
        endPx,
        nameLabel: { text: g.name, xPx: endPx.x, yPx: endPx.y + labelGapPx },
      };
    }),
  };
}

export type Scene = ReturnType<typeof buildScene>;
