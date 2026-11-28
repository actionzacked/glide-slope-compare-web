import { useEffect, useRef } from "react";
import { buildScene, type Glide } from "../scene/buildScene";
import { drawScene } from "../scene/drawScene";

interface ProfileCanvasProps {
  glides: [Glide, ...Glide[]];
}

export function ProfileCanvas({ glides }: ProfileCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const observer = new ResizeObserver(() => {
      const widthPx = canvas.clientWidth;
      const heightPx = canvas.clientHeight;
      // Draw at the screen's pixel density so lines and text stay sharp.
      const pixelRatio = window.devicePixelRatio;
      canvas.width = Math.round(widthPx * pixelRatio);
      canvas.height = Math.round(heightPx * pixelRatio);
      const context = canvas.getContext("2d");
      if (context === null) {
        throw new Error("This browser cannot draw on a canvas.");
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawScene(context, buildScene({ widthPx, heightPx, glides }), {
        widthPx,
        heightPx,
      });
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
    };
  }, [glides]);

  return (
    <canvas
      ref={canvasRef}
      className="profile-canvas"
      role="img"
      aria-label="Glide profile"
    />
  );
}
