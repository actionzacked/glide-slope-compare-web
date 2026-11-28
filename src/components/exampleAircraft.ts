import type { GlideInputs } from "../glide/glide";

// A made-up stand-in so the app works before the cited aircraft presets arrive; not a real aircraft.
export const exampleAircraft = {
  name: "Example 9:1",
  glideRatio: 9,
  bestGlideSpeedKt: 65,
  startAltitudeFt: 3000,
} satisfies GlideInputs & { name: string };
