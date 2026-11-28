import { Icon } from "./Icon";

interface SettingsPanelProps {
  onShare: () => void;
}

export function SettingsPanel({ onShare }: SettingsPanelProps) {
  return (
    <aside className="panel" aria-label="Settings">
      <button type="button" className="phone-only" onClick={onShare}>
        <Icon name="share" />
        Share
      </button>
    </aside>
  );
}
