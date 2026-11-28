import { useEffect, useState } from "react";
import type { Glide } from "../scene/buildScene";
import { glide } from "../glide/glide";
import { AircraftCard } from "./AircraftCard";
import { exampleAircraft } from "./exampleAircraft";
import { ProfileCanvas } from "./ProfileCanvas";
import { SettingsPanel } from "./SettingsPanel";
import { shareSiteLink } from "./shareSiteLink";
import { Toolbar, type Panel } from "./Toolbar";

const exampleResult = glide(exampleAircraft);
// The profile needs a glide distance to scale to, so it is left out when there is no result.
const shareMessageDurationMs = 2000;
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
  const [openPanel, setOpenPanel] = useState<Panel | null>("aircraft");
  const [playbackShown, setPlaybackShown] = useState(true);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (shareMessage === "") return;
    const timer = setTimeout(() => {
      setShareMessage("");
    }, shareMessageDurationMs);
    return () => {
      clearTimeout(timer);
    };
  }, [shareMessage]);

  function share() {
    void shareSiteLink().then((result) => {
      if (result === "copied") setShareMessage("Link copied");
    });
  }

  return (
    <main className="app">
      <div className="profile">
        <h1 className="title">Glide Compare</h1>
        <Toolbar
          openPanel={openPanel}
          onTogglePanel={(panel) => {
            setOpenPanel(openPanel === panel ? null : panel);
          }}
          playbackShown={playbackShown}
          onTogglePlayback={() => {
            setPlaybackShown(!playbackShown);
          }}
          onShare={share}
        />
        <p className="share-message" role="status">
          {shareMessage}
        </p>
        {profileGlides === null ? null : (
          <ProfileCanvas glides={profileGlides} />
        )}
      </div>
      {playbackShown ? (
        <section className="playback" aria-label="Playback"></section>
      ) : null}
      {openPanel === "aircraft" ? (
        <aside className="panel" aria-label="Aircraft">
          <AircraftCard name={exampleAircraft.name} {...exampleResult} />
          <p className="note">
            Example 9:1 is a made-up aircraft for trying the app, not a real
            one.
          </p>
        </aside>
      ) : null}
      {openPanel === "settings" ? <SettingsPanel onShare={share} /> : null}
    </main>
  );
}
