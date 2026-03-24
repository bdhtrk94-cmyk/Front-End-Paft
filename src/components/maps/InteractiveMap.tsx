'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { paftCountries, PaftCountry } from '@/lib/mapData';

// Fix default marker icons for Leaflet in Next.js / Webpack
import 'leaflet/dist/leaflet.css';

/* ------------------------------------------------------------------ */
/* Sub-component: adds markers when map is ready                      */
/* ------------------------------------------------------------------ */
function MapMarkers({ onFocusReady, language }: { onFocusReady: (fn: (name: string) => void) => void; language: string }) {
    const map = useMap();
    const markersRef = useRef<{ marker: L.Marker; country: PaftCountry }[]>([]);
    const isAr = language === 'ar';

    const focusCountry = useCallback(
        (name: string) => {
            const entry = paftCountries.find((c) => c.name === name);
            if (!entry) return;

            map.flyTo(entry.coords, 8, { animate: true, duration: 1.5 });

            setTimeout(() => {
                const found = markersRef.current.find((m) => m.country.name === name);
                found?.marker.openPopup();
            }, 800);
        },
        [map],
    );

    useEffect(() => {
        // Expose focus function to parent
        onFocusReady(focusCountry);

        // Add markers
        paftCountries.forEach((country) => {
            const isHQ = country.type === 'headquarters';
            const isRegionalOffice = country.type === 'regional-office';
            const size = isHQ ? 28 : isRegionalOffice ? 22 : 18;

            const markerClass = isHQ
                ? 'paft-map-marker paft-map-marker--hq'
                : isRegionalOffice
                    ? 'paft-map-marker paft-map-marker--regional'
                    : 'paft-map-marker';

            const icon = L.divIcon({
                html: `<div class="${markerClass}"></div>`,
                className: 'paft-custom-marker',
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });

            const marker = L.marker(country.coords, { icon }).addTo(map);

            const displayName = isAr ? country.nameAr : country.name;
            const labelText = isHQ
                ? (isAr ? 'المقر الرئيسي' : 'Headquarters')
                : isRegionalOffice
                    ? (isAr ? 'مكتب إقليمي' : 'Regional Office')
                    : '';
            const labelEmoji = isHQ ? '⭐ ' : isRegionalOffice ? '🏢 ' : '📍 ';

            const popupHtml = `
        <div style="text-align:center;min-width:160px;font-family:system-ui,sans-serif;direction:${isAr ? 'rtl' : 'ltr'};">
          <h4 style="margin:0 0 6px;color:#1f2937;font-size:1rem;font-weight:700;">
            ${labelEmoji}${displayName}
          </h4>
          ${labelText ? `<p style="margin:0 0 6px;color:${isRegionalOffice ? '#10B981' : '#6b7280'};font-size:0.85rem;font-weight:600;">
            ${labelText}
          </p>` : ''}
          <p style="margin:0;color:#9ca3af;font-size:0.78rem;">
            ${country.region}
          </p>
        </div>
      `;

            marker.bindPopup(popupHtml, {
                className: 'paft-popup',
                closeButton: true,
                maxWidth: 220,
            });

            markersRef.current.push({ marker, country });
        });

        return () => {
            markersRef.current.forEach(({ marker }) => marker.remove());
            markersRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isAr]);

    return null;
}

/* ------------------------------------------------------------------ */
/* Sub-component: keyboard shortcuts                                  */
/* ------------------------------------------------------------------ */
function MapKeyboard({ markersRef }: { markersRef: React.RefObject<{ marker: L.Marker; country: PaftCountry }[] | null> }) {
    const map = useMap();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') {
                map.setView([20, 20], 2);
            }
            if (e.key === 'a' || e.key === 'A') {
                const ms = markersRef.current;
                if (ms && ms.length > 0) {
                    const group = L.featureGroup(ms.map((m) => m.marker));
                    map.fitBounds(group.getBounds().pad(0.1));
                }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [map, markersRef]);

    return null;
}

/* ------------------------------------------------------------------ */
/* Main export                                                        */
/* ------------------------------------------------------------------ */
interface InteractiveMapProps {
    onFocusReady: (fn: (name: string) => void) => void;
    onMapReady?: (map: L.Map) => void;
    language?: string;
}

export default function InteractiveMap({ onFocusReady, onMapReady, language = 'en' }: InteractiveMapProps) {
    const markersRef = useRef<{ marker: L.Marker; country: PaftCountry }[]>([]);

    return (
        <MapContainer
            center={[20, 20]}
            zoom={2}
            zoomControl={false}
            worldCopyJump
            className="w-full h-full z-[1]"
            style={{ background: '#e8f4f8' }}
            ref={(mapRef) => {
                if (mapRef && onMapReady) onMapReady(mapRef);
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={18}
                minZoom={2}
            />
            <MapMarkers onFocusReady={onFocusReady} language={language} />
            <MapKeyboard markersRef={markersRef} />
            <ZoomControl />
        </MapContainer>
    );
}

function ZoomControl() {
    const map = useMap();
    useEffect(() => {
        const ctrl = L.control.zoom({ position: 'bottomleft' });
        ctrl.addTo(map);
        return () => {
            ctrl.remove();
        };
    }, [map]);
    return null;
}
