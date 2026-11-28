import { exampleAircraft } from "../exampleAircraft";
import { glide } from "../glide/glide";
import { AircraftCard } from "./AircraftCard";
import { ProfileCanvas } from "./ProfileCanvas";

const exampleResult = glide(exampleAircraft);
const profileGlides =
  exampleResult.glideDistanceFt === null
    ? []
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
        <ProfileCanvas glides={profileGlides} />
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
