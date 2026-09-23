"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MAP_BOUNDS, OFERTAS_TURISTICAS, CATEGORIA_OFERTA_LABEL, UNIDAD_PRECIO_LABEL } from "@/lib/mock-data";
import { paradasConectadas } from "@/lib/itinerary";
import { formatUsd } from "@/lib/money";
import { useTourist } from "@/components/tourist/TouristProvider";
import type { BasemapId } from "@/components/tourist/InteractiveMap";
import type { CategoriaOferta, Coordenada, OfertaTuristica } from "@/types/tourist";
import "leaflet/dist/leaflet.css";
import "./rural-map.css";

const PIN_COLORS: Record<CategoriaOferta, string> = {
  alojamiento: "#047857",
  tour: "#0369a1",
  producto: "#d97706",
  paquete: "#6d28d9",
};

const PIN_LETTER: Record<CategoriaOferta, string> = {
  alojamiento: "A",
  tour: "T",
  producto: "P",
  paquete: "K",
};

const TILES: Record<BasemapId, { url: string; attribution: string }> = {
  calles: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom",
  },
  satelite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
  relieve: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri — Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  },
};

const CORRIDOR_BOUNDS: L.LatLngBoundsExpression = [
  [MAP_BOUNDS.minLat - 0.08, MAP_BOUNDS.minLng - 0.12],
  [MAP_BOUNDS.maxLat + 0.08, MAP_BOUNDS.maxLng + 0.08],
];

function toLatLng(coord: Coordenada): L.LatLngExpression {
  return [coord.lat, coord.lng];
}

function pinIcon(oferta: OfertaTuristica, order: number | undefined, selected: boolean, dimmed: boolean) {
  const color = PIN_COLORS[oferta.categoria];
  const label = order ? String(order) : PIN_LETTER[oferta.categoria];
  const stroke = selected ? "#fbbf24" : order ? "#fef3c7" : "#ffffff";
  const strokeWidth = selected ? 3 : 1.6;
  return L.divIcon({
    className: "turistellar-pin",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -34],
    tooltipAnchor: [0, -36],
    html: `<div style="opacity:${dimmed ? 0.38 : 1};filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))">
      <svg width="34" height="42" viewBox="0 0 34 42" aria-hidden="true">
        <path d="M17 41s13-12.2 13-22A13 13 0 1 0 4 19c0 9.8 13 22 13 22z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
        <circle cx="17" cy="17" r="8" fill="#fff"/>
        <text x="17" y="21" text-anchor="middle" font-size="11" font-weight="700" fill="${color}" font-family="Arial,sans-serif">${label}</text>
      </svg>
    </div>`,
  });
}

function FitCorridor({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(positions), {
        paddingTopLeft: [48, 72],
        paddingBottomRight: [48, 88],
        maxZoom: 13,
      });
    };
    fit();
    const timer = window.setTimeout(fit, 250);
    return () => window.clearTimeout(timer);
  }, [map, positions]);

  return null;
}

function FlyToSelection({ focus }: { focus: L.LatLngExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    map.flyTo(focus, 14, { duration: 0.6 });
  }, [focus, map]);

  return null;
}

function InvalidateOnResize() {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize();
    window.addEventListener("resize", refresh);
    const timer = window.setTimeout(refresh, 150);
    return () => {
      window.removeEventListener("resize", refresh);
      window.clearTimeout(timer);
    };
  }, [map]);

  return null;
}

function WheelZoom({ enabled }: { enabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (enabled) map.scrollWheelZoom.enable();
    else map.scrollWheelZoom.disable();
  }, [enabled, map]);

  return null;
}

function OfertaMarker({
  oferta,
  order,
  selected,
  dimmed,
  inItinerary,
  onSelect,
}: {
  oferta: OfertaTuristica;
  order?: number;
  selected: boolean;
  dimmed: boolean;
  inItinerary: boolean;
  onSelect: (id: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const { addOferta, removeItem, items } = useTourist();
  const icon = useMemo(
    () => pinIcon(oferta, order, selected || order !== undefined, dimmed),
    [oferta, order, selected, dimmed],
  );

  useEffect(() => {
    if (selected) markerRef.current?.openPopup();
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={toLatLng(oferta.coordenadas)}
      icon={icon}
      zIndexOffset={selected ? 800 : order ? 400 : 0}
      eventHandlers={{ click: () => onSelect(oferta.id) }}
    >
      <Tooltip direction="top" opacity={1}>
        <span className="text-xs font-medium text-zinc-900">{oferta.titulo}</span>
      </Tooltip>
      <Popup className="turistellar-popup" autoPan>
        <div className="space-y-2 text-zinc-900">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
            {order ? `Parada ${order} · ` : ""}
            {CATEGORIA_OFERTA_LABEL[oferta.categoria]}
          </p>
          <p className="text-sm font-semibold leading-snug">{oferta.titulo}</p>
          <p className="text-xs text-zinc-600">{oferta.empresa}</p>
          <p className="text-xs text-zinc-600">{oferta.ubicacion}</p>
          <p className="text-sm font-medium">
            {formatUsd(oferta.precioUsd)}
            <span className="font-normal text-zinc-500"> / {UNIDAD_PRECIO_LABEL[oferta.unidadPrecio]}</span>
          </p>
          {inItinerary ? (
            <button
              type="button"
              className="w-full rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
              onClick={() => {
                const row = items.find((item) => item.ofertaId === oferta.id);
                if (row) removeItem(row.id);
              }}
            >
              Quitar del itinerario
            </button>
          ) : (
            <button
              type="button"
              className="w-full rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
              onClick={() => addOferta(oferta.id)}
            >
              Agregar al itinerario
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export interface RuralLeafletMapProps {
  basemap: BasemapId;
  emphasizedIds?: readonly string[];
  selectedId?: string | null;
  onSelectOferta?: (ofertaId: string) => void;
  scrollWheelZoom?: boolean;
  recenterToken: number;
}

export function RuralLeafletMap({
  basemap,
  emphasizedIds,
  selectedId,
  onSelectOferta,
  scrollWheelZoom = false,
  recenterToken,
}: RuralLeafletMapProps) {
  const { items } = useTourist();
  const mapRef = useRef<L.Map | null>(null);

  const markers = useMemo(
    () => OFERTAS_TURISTICAS.filter((row) => row.categoria !== "paquete"),
    [],
  );
  const stops = useMemo(() => paradasConectadas(items), [items]);
  const orderById = useMemo(() => {
    const map = new Map<string, number>();
    stops.forEach((stop, index) => map.set(stop.id, index + 1));
    return map;
  }, [stops]);
  const inItinerary = useMemo(() => new Set(items.map((row) => row.ofertaId)), [items]);
  const emphasis = useMemo(
    () => (emphasizedIds ? new Set(emphasizedIds) : null),
    [emphasizedIds],
  );
  const positions = useMemo(() => markers.map((row) => toLatLng(row.coordenadas)), [markers]);
  const route = useMemo(() => stops.map((stop) => toLatLng(stop.coordenadas)), [stops]);
  const focus = useMemo(() => {
    const direct = markers.find((row) => row.id === selectedId);
    if (direct) return toLatLng(direct.coordenadas);
    const paquete = OFERTAS_TURISTICAS.find((row) => row.id === selectedId);
    const child = markers.find((row) => row.id === paquete?.incluyeIds?.[0]);
    return child ? toLatLng(child.coordenadas) : null;
  }, [markers, selectedId]);

  const tile = TILES[basemap];
  const tileUrl = tile.url;

  useEffect(() => {
    if (recenterToken === 0) return;
    const map = mapRef.current;
    if (!map) return;
    const target = route.length >= 2 ? route : positions;
    if (target.length === 0) return;
    map.fitBounds(L.latLngBounds(target), {
      paddingTopLeft: [48, 72],
      paddingBottomRight: [48, 88],
      maxZoom: 13,
    });
  }, [positions, recenterToken, route]);

  return (
    <MapContainer
      ref={mapRef}
      center={[4.64, -75.55]}
      zoom={12}
      minZoom={11}
      maxZoom={18}
      maxBounds={CORRIDOR_BOUNDS}
      maxBoundsViscosity={0.7}
      scrollWheelZoom={scrollWheelZoom}
      className="turistellar-map"
    >
      <TileLayer key={tileUrl} attribution={tile.attribution} url={tileUrl} />
      <ScaleControl position="bottomleft" imperial={false} />
      <WheelZoom enabled={scrollWheelZoom} />
      <InvalidateOnResize />
      <FitCorridor positions={positions} />
      <FlyToSelection focus={focus} />
      {route.length >= 2 ? (
        <>
          <Polyline
            positions={route}
            pathOptions={{ color: "#ffffff", weight: 7, opacity: 0.85, lineCap: "round", lineJoin: "round" }}
          />
          <Polyline
            positions={route}
            pathOptions={{
              color: "#f59e0b",
              weight: 4,
              opacity: 0.95,
              dashArray: "10 8",
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </>
      ) : null}
      {markers.map((oferta) => (
        <OfertaMarker
          key={oferta.id}
          oferta={oferta}
          order={orderById.get(oferta.id)}
          selected={selectedId === oferta.id}
          dimmed={emphasis ? !emphasis.has(oferta.id) : false}
          inItinerary={inItinerary.has(oferta.id) || orderById.has(oferta.id)}
          onSelect={(id) => onSelectOferta?.(id)}
        />
      ))}
    </MapContainer>
  );
}
