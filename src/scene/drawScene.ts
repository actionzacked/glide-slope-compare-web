import type { Scene } from "./buildScene";

const colours = {
  sky: "#eaf2fb",
  gridLine: "rgba(17, 24, 39, 0.12)",
  ground: "#a3b18a",
  groundLine: "#4b5d33",
  glide: "#1d4ed8",
  text: "#111827",
};
const font = "13px system-ui, sans-serif";

interface PictureSize {
  widthPx: number;
  heightPx: number;
}

export function drawScene(
  context: CanvasRenderingContext2D,
  scene: Scene,
  { widthPx, heightPx }: PictureSize,
) {
  context.fillStyle = colours.sky;
  context.fillRect(0, 0, widthPx, heightPx);

  context.strokeStyle = colours.gridLine;
  context.lineWidth = 1;
  for (const line of scene.altitudeGridLines) {
    context.beginPath();
    context.moveTo(scene.plotLeftPx, line.yPx);
    context.lineTo(widthPx, line.yPx);
    context.stroke();
  }

  context.fillStyle = colours.ground;
  context.fillRect(0, scene.groundYPx, widthPx, heightPx - scene.groundYPx);
  context.strokeStyle = colours.groundLine;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(0, scene.groundYPx);
  context.lineTo(widthPx, scene.groundYPx);
  context.stroke();

  context.font = font;
  context.fillStyle = colours.text;
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (const label of scene.altitudeLabels) {
    context.fillText(label.text, label.xPx, label.yPx);
  }

  context.strokeStyle = colours.glide;
  context.lineWidth = 3;
  context.textBaseline = "top";
  for (const glide of scene.glides) {
    context.beginPath();
    context.moveTo(glide.startPx.x, glide.startPx.y);
    context.lineTo(glide.endPx.x, glide.endPx.y);
    context.stroke();
    context.fillText(
      glide.nameLabel.text,
      glide.nameLabel.xPx,
      glide.nameLabel.yPx,
    );
  }
}
