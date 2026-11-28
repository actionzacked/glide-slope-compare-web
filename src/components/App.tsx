import type { Glide } from "../scene/buildScene";
import { glide } from "../glide/glide";
import { AircraftCard } from "./AircraftCard";
import { exampleAircraft } from "./exampleAircraft";
import { ProfileCanvas } from "./ProfileCanvas";

const exampleResult = glide(exampleAircraft);
// The profile needs a glide distance to scale to, so it is left out when there is no result.
const profileGlides: [Glide] | null =
  exampleResult.glideDistanceFt === null
    ? null
    : [
        {
          name: exampleAircraft.name,
          startAltitudeFt: exampleAircraft.startAltitudeFt,
          glideDistanceFt: exampleResult.glideDistanceFt,
        },
      ];

export function App() {
  return (
    <main>
      <div className="profile">
        <h1 className="title">Glide Compare</h1>
        {profileGlides === null ? null : (
          <ProfileCanvas glides={profileGlides} />
        )}
      </div>
      <aside className="panel" aria-label="Aircraft">
        <AircraftCard name={exampleAircraft.name} {...exampleResult} />
        <p className="note">
          Example 9:1 is a made-up aircraft for trying the app, not a real one.
        </p>
      </aside>
    </main>
  );
}
