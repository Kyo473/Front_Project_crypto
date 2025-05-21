import React from 'react';
import { YMaps, Map as YMap, Placemark } from '@pbe/react-yandex-maps';

interface Marker {
    id: string;
    position: [number, number];
    title: string;
    description: string;
}

interface MapProps {
    center: [number, number];
    zoom: number;
    markers: Marker[];
}

const Map: React.FC<MapProps> = ({ center, zoom, markers }) => {
    return (
        <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP }}>
            <YMap
                defaultState={{
                    center,
                    zoom
                }}
                width="100%"
                height="100%"
            >
                {markers.map(marker => (
                    <Placemark
                        key={marker.id}
                        geometry={marker.position}
                        properties={{
                            balloonContent: `
                                <h3>${marker.title}</h3>
                                <p>${marker.description}</p>
                            `
                        }}
                        options={{
                            preset: 'islands#blueStretchyIcon'
                        }}
                    />
                ))}
            </YMap>
        </YMaps>
    );
};

export default Map; 