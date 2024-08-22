import React, {useEffect} from "react";
import {load} from "@2gis/mapgl";
import classes from "@components/About/About.module.scss"

const MapContext = React.createContext([undefined, () => {
}]);

const MapProvider = (props: any) => {
    const [_, setMapInstance] = React.useContext(MapContext);

    return (
        <MapContext.Provider value={[setMapInstance]}>
            {props.children}
        </MapContext.Provider>
    );
};

export default function Map() {
    useEffect(() => {

    }, []);

    return (
        <MapProvider>
            <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A5859eb398ded11d5aad37a78dae7fd05d2582c7929af33489618f0d95e68f54d&amp;source=constructor"
                width="100%" height="450" frameBorder="0"></iframe>
        </MapProvider>
    );
}

const MapWrapper = React.memo(
    () => {
        return <div id="map-container" style={{width: '100%', height: '100%'}}></div>;
    },
    () => true,
);
