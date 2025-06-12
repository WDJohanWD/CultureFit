import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Icon fuera del componente para evitar recreación
const customIcon = new Icon({
  iconUrl: "Mark.png",
  iconSize: [45, 40],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
});

// Markers también fuera para evitar recreaciones
const markers = [
  {
    geocode: [42.242879, -8.696784],
    popUp: "CultureFit",
  },
];

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

function AboutUs() {
  const { t } = useTranslation("aboutus");

  return (
    <section className="relative z-0 p-4 flex flex-col items-center gap-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t("title")}
        </h1>
        <h2 className="text-xl font-medium text-gray-700 sm:text-2xl">
          {t("ubication")}
        </h2>
      </header>

      <motion.div
        className="w-full max-w-5xl relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MapContainer
          center={[42.242794462547636, -8.696215562890764]}
          zoom={15}
          className="h-[400px] rounded-xl shadow-md overflow-hidden"
          attributionControl={false}
        >
          <TileLayer
            url="https://tile.jawg.io/35e6ff0b-cb69-4fa9-9e05-6606986d694d/{z}/{x}/{y}{r}.png?access-token=gKJKSFJEZfMAAS1eLraY1gTLsV7NKuosbvKrfwSsJH5ZHHl24sRaTiM9pMjzhtG1"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.geocode}
              icon={customIcon}
              title={marker.popUp}
            >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
          <InvalidateMapSize />
          <div className="absolute bottom-2 left-2 z-[999] text-[10px] text-gray-500 bg-white/70 px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
            &copy;{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>{" "}
            contributors &nbsp;&copy;&nbsp;
            <a
              href="https://www.jawg.io"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jawg
            </a>
          </div>
        </MapContainer>
      </motion.div>
    </section>
  );
}

export default AboutUs;
