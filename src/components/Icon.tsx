// Line icons from the layout prototype, drawn on a 24-unit grid in the text colour.
const paths = {
  aircraft: (
    <path
      fill="currentColor"
      stroke="none"
      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
    />
  ),
  playback: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path fill="currentColor" d="M10 9v6l5-3z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  share: <path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7" />,
  fullScreen: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
};

interface IconProps {
  name: keyof typeof paths;
}

export function Icon({ name }: IconProps) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
