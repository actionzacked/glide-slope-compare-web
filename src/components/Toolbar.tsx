import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Icon } from "./Icon";
import { useFullScreen } from "./useFullScreen";

export type Panel = "aircraft" | "settings";

interface ToolbarProps {
  openPanel: Panel | null;
  onTogglePanel: (panel: Panel) => void;
  playbackShown: boolean;
  onTogglePlayback: () => void;
  onShare: () => void;
}

export function Toolbar({
  openPanel,
  onTogglePanel,
  playbackShown,
  onTogglePlayback,
  onShare,
}: ToolbarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [fullScreen, toggleFullScreen] = useFullScreen();
  const hideButtonRef = useRef<HTMLButtonElement>(null);
  const showButtonRef = useRef<HTMLButtonElement>(null);

  // Focus follows the control that replaces the one just pressed, so keyboard users keep their place.
  function setCollapsedAndRefocus(nextCollapsed: boolean) {
    flushSync(() => {
      setCollapsed(nextCollapsed);
    });
    (nextCollapsed ? showButtonRef : hideButtonRef).current?.focus();
  }

  return (
    <>
      <div
        className="toolbar"
        role="group"
        aria-label="Toolbar"
        data-collapsed={collapsed}
        inert={collapsed}
      >
        <button
          ref={hideButtonRef}
          type="button"
          aria-label="Hide toolbar"
          onClick={() => {
            setCollapsedAndRefocus(true);
          }}
        >
          <Icon name="chevronRight" />
        </button>
        <button
          type="button"
          aria-label="Aircraft"
          aria-pressed={openPanel === "aircraft"}
          onClick={() => {
            onTogglePanel("aircraft");
          }}
        >
          <Icon name="aircraft" />
        </button>
        <button
          type="button"
          aria-label="Playback"
          aria-pressed={playbackShown}
          onClick={onTogglePlayback}
        >
          <Icon name="playback" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          aria-pressed={openPanel === "settings"}
          onClick={() => {
            onTogglePanel("settings");
          }}
        >
          <Icon name="settings" />
        </button>
        <button
          type="button"
          className="wide-only"
          aria-label="Share"
          onClick={onShare}
        >
          <Icon name="share" />
        </button>
        {/* iPhone Safari cannot make a web page full screen, so the button only shows where it works. */}
        {document.fullscreenEnabled ? (
          <button
            type="button"
            className="wide-only"
            aria-label="Full screen"
            aria-pressed={fullScreen}
            onClick={toggleFullScreen}
          >
            <Icon name="fullScreen" />
          </button>
        ) : null}
      </div>
      {collapsed ? (
        <button
          ref={showButtonRef}
          type="button"
          className="toolbar-tab"
          aria-label="Show toolbar"
          onClick={() => {
            setCollapsedAndRefocus(false);
          }}
        >
          <Icon name="chevronLeft" />
        </button>
      ) : null}
    </>
  );
}
