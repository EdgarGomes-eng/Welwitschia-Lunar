import { num } from "../../game";
import type { ResourceKey, Resources } from "../../game";
import { RESOURCE_LABELS } from "../labels";

const RESOURCE_KEYS: ResourceKey[] = ["life", "energy", "protection", "food"];

interface ResourceBarProps {
  resources: Resources;
  compact?: boolean;
}

export default function ResourceBar({ resources, compact = false }: ResourceBarProps) {
  return (
    <div className={compact ? "resource-list compact" : "resource-list"}>
      {RESOURCE_KEYS.map((key) => {
        const value = resources[key];
        const percent = (value / num("rules.resourceMax")) * num("rules.percentScale");

        return (
          <div className="resource" key={key}>
            <div className="resource-label">
              <span>{RESOURCE_LABELS[key]}</span>
              <strong>{value}</strong>
            </div>
            <div className="bar">
              <div className={`bar-fill ${key}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
