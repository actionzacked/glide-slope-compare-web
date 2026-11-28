import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => {
    document.removeEventListener("fullscreenchange", onChange);
  };
}

function isFullScreen() {
  return document.fullscreenElement !== null;
}

function toggleFullScreen() {
  if (isFullScreen()) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen();
  }
}

// Follows the browser's own state, so leaving full screen with Esc also unlights the icon.
export function useFullScreen() {
  return [
    useSyncExternalStore(subscribe, isFullScreen),
    toggleFullScreen,
  ] as const;
}
