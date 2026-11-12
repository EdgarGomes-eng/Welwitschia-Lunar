import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { getLightGrid, getMap, getModule, num } from "../../game";
import type { BuiltModule, ScenarioId, TerrainType } from "../../game";
import { TERRAIN_LABELS } from "../labels";

const TERRAIN_COLORS: Record<TerrainType, string> = {
  flat: "#475569",
  slope: "#334155",
  rim: "#78716c",
  psr: "#1e1b4b",
  ice: "#67e8f9",
};

const TERRAIN_ORDER: TerrainType[] = ["rim", "flat", "slope", "psr", "ice"];

interface LunarMapProps {
  scenarioId: ScenarioId;
  day: number;
  modules: BuiltModule[];
  selectedCell?: { x: number; y: number } | null;
  onCellClick?: (x: number, y: number) => void;
  interactive?: boolean;
}

export default function LunarMap({
  scenarioId,
  day,
  modules,
  selectedCell,
  onCellClick,
  interactive = false,
}: LunarMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasPixels = num("map.canvasPixels");
  const mapWidth = num("map.width");
  const mapHeight = num("map.height");
  const canvasHeight = (canvasPixels * mapHeight) / mapWidth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const map = getMap(scenarioId);
    const light = getLightGrid(scenarioId, day);
    const cellWidth = canvas.width / map.width;
    const cellHeight = canvas.height / map.height;
    const shadow = num("map.light.shadow");

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const cell = map.cells[y]?.[x];
        if (!cell) {
          continue;
        }

        context.fillStyle = TERRAIN_COLORS[cell.terrain];
        context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

        if (light[y]?.[x] === shadow) {
          context.fillStyle = "rgba(2, 6, 23, 0.58)";
          context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }

        context.strokeStyle = "rgba(148, 163, 184, 0.18)";
        context.lineWidth = 1;
        context.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }

    for (const built of modules) {
      const module = getModule(built.moduleId);
      const centerX = (built.x + 0.5) * cellWidth;
      const centerY = (built.y + 0.5) * cellHeight;
      const radius = Math.min(cellWidth, cellHeight) * 0.28;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fillStyle = module.cor;
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.82)";
      context.lineWidth = 2;
      context.stroke();
    }

    if (selectedCell) {
      context.strokeStyle = "#f8fafc";
      context.lineWidth = 3;
      context.strokeRect(
        selectedCell.x * cellWidth + 2,
        selectedCell.y * cellHeight + 2,
        cellWidth - 4,
        cellHeight - 4,
      );
    }
  }, [scenarioId, day, modules, selectedCell]);

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (!onCellClick) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * mapWidth);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * mapHeight);

    if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight) {
      onCellClick(x, y);
    }
  }

  return (
    <div className="map-frame">
      <canvas
        ref={canvasRef}
        className="lunar-map"
        width={canvasPixels}
        height={canvasHeight}
        onPointerDown={handlePointerDown}
        style={{ cursor: interactive ? "pointer" : "default" }}
        aria-label={`Mapa lunar do cenário ${scenarioId}, dia ${day}`}
      />
      <div className="map-legend" aria-hidden="true">
        {TERRAIN_ORDER.map((terrain) => (
          <span className="legend-item" key={terrain}>
            <span
              className="legend-swatch"
              style={{ background: TERRAIN_COLORS[terrain] }}
            />
            {TERRAIN_LABELS[terrain]}
          </span>
        ))}
        <span className="legend-item">
          <span className="legend-swatch legend-swatch-shadow" />
          Sombra
        </span>
      </div>
    </div>
  );
}
