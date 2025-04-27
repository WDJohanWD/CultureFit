import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function AboutUs() {
  const { t } = useTranslation("aboutus");

  const markers = [
    {
      geocode: [42.242879, -8.696784],
      popUp: "CultureFit",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "Mark.png",
    iconSize: [45, 40],
  });

  function MapFixer() {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  }

  return (
    <div className="relative z-0 p-4 flex flex-col items-center gap-4">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center">
        {t("title")}
      </h1>
      <h2 className="text-xl font-semibold tracking-tight text-gray-700 sm:text-2xl text-center">
        {t("ubication")}
      </h2>

      <div className="w-full max-w-5xl relative">
        <MapContainer
          center={[42.242794462547636, -8.696215562890764]}
          zoom={15}
          className="h-[400px] rounded-xl shadow-lg relative"
          attributionControl={false}
        >
          <TileLayer
            url="https://tile.jawg.io/35e6ff0b-cb69-4fa9-9e05-6606986d694d/{z}/{x}/{y}{r}.png?access-token=gKJKSFJEZfMAAS1eLraY1gTLsV7NKuosbvKrfwSsJH5ZHHl24sRaTiM9pMjzhtG1"
          />

          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}

          <MapFixer />

          <div className="absolute bottom-2 left-2 z-[999] text-[10px] text-gray-500 bg-transparent">
            &copy; <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap</a> contributors &copy; <a href="https://www.jawg.io" className="underline">Jawg</a>
          </div>
        </MapContainer>
      </div>
    </div>
  );
}

export default AboutUs;
