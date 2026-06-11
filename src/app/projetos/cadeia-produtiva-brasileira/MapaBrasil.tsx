"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MaplibreMap, GeoJSONSource } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { Fabricante } from "@/data/fabricantes";
import { colorFor, sectorColors } from "./sectorColors";

// ─── Constants ───────────────────────────────────────────────────────────────

const BRAZIL_CENTER: [number, number] = [-51.9253, -14.235];
const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const SELECT_ZOOM = 8;

// ─── Types ───────────────────────────────────────────────────────────────────

interface FabricanteMarcado {
  fab: Fabricante;
  coords: [number, number]; // [lat, lng] as stored upstream
}

interface Props {
  fabricantes: FabricanteMarcado[];
  onSelect: (fab: Fabricante) => void;
  selecionado: Fabricante | null;
  /** Currently active sector filter (highlights its legend entry). */
  setorAtivo?: string;
  /** Click a legend entry to filter by that sector (toggles off if active). */
  onSelectSetor?: (setor: string) => void;
  /** Sectors present in the current results, for dimming empty legend entries. */
  setoresPresentes?: ReadonlySet<string>;
}

interface DotProps {
  id: number;
  nome: string;
  setor: string;
  cidade: string;
  sigla: string;
  color: string;
  selected: 0 | 1;
}

// ─── GeoJSON builder ─────────────────────────────────────────────────────────

function buildGeoJSON(
  items: FabricanteMarcado[],
  selecionadoId: number | null
): FeatureCollection<Point, DotProps> {
  return {
    type: "FeatureCollection",
    features: items.map(({ fab, coords }) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [coords[1], coords[0]] },
      properties: {
        id: fab.id,
        nome: fab.nome,
        setor: fab.setor,
        cidade: fab.localizacao.cidade,
        sigla: fab.localizacao.sigla,
        color: colorFor(fab.setor),
        selected: selecionadoId === fab.id ? 1 : 0,
      },
    })),
  };
}

const escapeHTML = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;"
    : c === "<" ? "&lt;"
    : c === ">" ? "&gt;"
    : c === '"' ? "&quot;"
    : "&#39;"
  );

// ─── Component ───────────────────────────────────────────────────────────────

export default function MapaBrasil({
  fabricantes,
  onSelect,
  selecionado,
  setorAtivo,
  onSelectSetor,
  setoresPresentes,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const styleReadyRef = useRef(false);

  const fabricantesRef = useRef(fabricantes);
  const onSelectRef = useRef(onSelect);
  fabricantesRef.current = fabricantes;
  onSelectRef.current = onSelect;

  const [ready, setReady] = useState(false);
  // Legend collapses on mobile so it doesn't blanket the map; opens on desktop.
  const [legendaAberta, setLegendaAberta] = useState(false);
  useEffect(() => {
    setLegendaAberta(window.innerWidth >= 1024);
  }, []);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let destroyed = false;

    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (destroyed || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: CARTO_DARK_STYLE,
        center: BRAZIL_CENTER,
        zoom: 3.8,
        minZoom: 3,
        maxZoom: 13,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right"
      );

      const tooltip = document.createElement("div");
      tooltip.setAttribute("role", "tooltip");
      tooltip.style.cssText = `
        position:absolute; pointer-events:none; z-index:10;
        background:#1a1a1a; border:0.5px solid rgba(248,246,232,0.15);
        padding:8px 12px; font-family:'Martian Mono',monospace; font-size:11px;
        line-height:1.5; color:#F8F6E8; white-space:nowrap; display:none;
      `;
      containerRef.current.appendChild(tooltip);
      tooltipRef.current = tooltip;

      map.on("load", () => {
        if (destroyed) return;

        map.addSource("fabricantes", {
          type: "geojson",
          data: buildGeoJSON(fabricantesRef.current, selecionado?.id ?? null),
        });

        // Selected glow
        map.addLayer({
          id: "fabricantes-selected-glow",
          type: "circle",
          source: "fabricantes",
          filter: ["==", ["get", "selected"], 1],
          paint: {
            "circle-radius": 14,
            "circle-color": ["get", "color"],
            "circle-opacity": 0.25,
            "circle-blur": 1,
          },
        });

        // Dots
        map.addLayer({
          id: "fabricantes-dots",
          type: "circle",
          source: "fabricantes",
          paint: {
            "circle-radius": [
              "interpolate", ["linear"], ["zoom"],
              3, 3.5,
              8, 5.5,
              12, 8,
            ],
            "circle-color": ["get", "color"],
            "circle-opacity": 0.92,
            "circle-stroke-width": [
              "case", ["==", ["get", "selected"], 1], 2, 0.5,
            ],
            "circle-stroke-color": [
              "case",
              ["==", ["get", "selected"], 1],
              "#F8F6E8",
              "rgba(248,246,232,0.3)",
            ],
          },
        });

        // Point click → select
        map.on("click", "fabricantes-dots", (e) => {
          const feature = e.features?.[0];
          const id = feature?.properties?.id as number | undefined;
          if (id == null) return;
          const hit = fabricantesRef.current.find((f) => f.fab.id === id);
          if (hit) onSelectRef.current(hit.fab);
        });

        // Cursor + tooltip for unclustered
        let lastHoverId: number | null = null;
        map.on("mousemove", "fabricantes-dots", (e) => {
          map.getCanvas().style.cursor = "pointer";
          const feature = e.features?.[0];
          if (!feature) return;
          const p = feature.properties as DotProps;
          if (p.id !== lastHoverId) {
            lastHoverId = p.id;
            tooltip.innerHTML =
              `<strong style="text-transform:uppercase;font-weight:700">${escapeHTML(p.nome)}</strong>` +
              `<br><span style="opacity:0.55;text-transform:uppercase">${escapeHTML(p.setor)}</span>` +
              `<br><span style="opacity:0.4">${escapeHTML(p.cidade)}, ${escapeHTML(p.sigla)}</span>`;
          }
          tooltip.style.display = "block";
          tooltip.style.left = `${e.point.x + 12}px`;
          tooltip.style.top = `${e.point.y - 10}px`;
        });
        map.on("mouseleave", "fabricantes-dots", () => {
          map.getCanvas().style.cursor = "";
          lastHoverId = null;
          tooltip.style.display = "none";
        });

        styleReadyRef.current = true;
        setReady(true);
      });

      mapRef.current = map;

      // Resize on container changes — MapLibre measures once at init,
      // so layout shifts (flex resolution, viewport changes) need an explicit resize.
      const ro = new ResizeObserver(() => {
        if (!destroyed) map.resize();
      });
      ro.observe(containerRef.current!);
      resizeObserverRef.current = ro;

      // Belt + suspenders: force one resize on next frame in case
      // the container was 0-height at the exact moment new Map() ran.
      requestAnimationFrame(() => {
        if (!destroyed) map.resize();
      });
    })();

    return () => {
      destroyed = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      tooltipRef.current?.remove();
      tooltipRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      styleReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update source data when props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const source = map.getSource("fabricantes") as GeoJSONSource | undefined;
      if (!source) return;
      source.setData(buildGeoJSON(fabricantes, selecionado?.id ?? null));
    };

    if (styleReadyRef.current) apply();
    else map.once("load", apply);
  }, [fabricantes, selecionado]);

  // Fly to selected point when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selecionado) return;
    const hit = fabricantes.find((f) => f.fab.id === selecionado.id);
    if (!hit) return;
    const [lat, lng] = hit.coords;
    const target: [number, number] = [lng, lat];
    const run = () => {
      map.easeTo({
        center: target,
        zoom: Math.max(map.getZoom(), SELECT_ZOOM),
        duration: 900,
      });
    };
    if (styleReadyRef.current) run();
    else map.once("load", run);
  }, [selecionado, fabricantes]);

  return (
    <>
      <style>{`
        .maplibregl-canvas { outline: none; }
        .maplibregl-ctrl-attrib {
          font-family: 'Martian Mono', monospace !important;
          font-size: 9px !important;
          background: rgba(20,20,20,0.7) !important;
          color: rgba(248,246,232,0.4) !important;
        }
        .maplibregl-ctrl-attrib a { color: rgba(248,246,232,0.4) !important; }
        .maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out, .maplibregl-ctrl-compass {
          background-color: #1a1a1a !important;
          border-color: rgba(248,246,232,0.1) !important;
        }
        .maplibregl-ctrl-zoom-in span, .maplibregl-ctrl-zoom-out span {
          filter: invert(1) opacity(0.6);
        }
        .maplibregl-ctrl-compass span { filter: invert(1) opacity(0.6); }
        .maplibregl-ctrl-group {
          background: #1a1a1a !important;
          border: 0.5px solid rgba(248,246,232,0.1) !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-ctrl button:not(:disabled):hover { background-color: #2a2a2a !important; }
      `}</style>

      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* Legend — collapsible (closed on mobile so it never blankets the map) */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 12,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          maxWidth: "calc(100% - 24px)",
        }}
      >
        <button
          type="button"
          onClick={() => setLegendaAberta((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(20,20,20,0.85)",
            border: "0.5px solid rgba(248,246,232,0.12)",
            padding: "6px 10px",
            fontFamily: "'Martian Mono', monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "rgba(248,246,232,0.7)",
            cursor: "pointer",
          }}
        >
          Setores
          <span style={{ opacity: 0.6 }}>{legendaAberta ? "▾" : "▸"}</span>
        </button>
      {legendaAberta && (
      <div
        style={{
          background: "rgba(20,20,20,0.85)",
          border: "0.5px solid rgba(248,246,232,0.12)",
          padding: "8px 12px",
          fontFamily: "'Martian Mono', monospace",
          fontSize: 9,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3px 14px",
          maxHeight: 200,
          maxWidth: "100%",
          overflowY: "auto",
        }}
      >
        {Object.entries(sectorColors).map(([s, c]) => {
          const ativo = setorAtivo === s;
          const algumAtivo = Boolean(setorAtivo);
          const presente = !setoresPresentes || setoresPresentes.has(s);
          const opacity = ativo ? 1 : !presente ? 0.28 : algumAtivo ? 0.5 : 0.6;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSetor?.(ativo ? "" : s)}
              title={ativo ? `Limpar filtro: ${s}` : `Filtrar por ${s}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                textTransform: "uppercase",
                color: `rgba(248,246,232,${opacity})`,
                whiteSpace: "nowrap",
                background: ativo ? "rgba(248,246,232,0.12)" : "transparent",
                border: "none",
                padding: "1px 3px",
                margin: "-1px -3px",
                font: "inherit",
                cursor: onSelectSetor ? "pointer" : "default",
                textAlign: "left",
                fontWeight: ativo ? 700 : 400,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c,
                  flexShrink: 0,
                  display: "inline-block",
                  outline: ativo ? "1.5px solid rgba(248,246,232,0.8)" : "none",
                  outlineOffset: 1,
                }}
              />
              {s}
            </button>
          );
        })}
      </div>
      )}
      </div>

      {/* Loading splash — fades out once style+source ready */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          zIndex: 20,
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
          transition: "opacity 0.3s var(--ease-out)",
        }}
        aria-hidden={ready}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid rgba(248,246,232,0.18)",
            borderTopColor: "#F8F6E8",
            borderRadius: "50%",
            animation: "pax-spin 0.9s linear infinite",
          }}
        />
        <span
          style={{
            fontFamily: "'Martian Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(248,246,232,0.5)",
          }}
        >
          Carregando mapa
        </span>
        <style>{`@keyframes pax-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
