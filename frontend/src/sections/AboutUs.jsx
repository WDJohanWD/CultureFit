import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Users, Globe } from "lucide-react";
import { GeoJSON } from "react-leaflet";
import gymData from "../assets/gym.json";

const customIcon = new Icon({
  iconUrl: "/Mark.webp",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],  
});

const markers = [
  {
    geocode: [42.439049, -8.691886],
    popUp: "Ximnasio municipal de Poio",
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
    <section className="relative z-0 px-4 py-10 flex flex-col items-center gap-10">
      <header className="text-center space-y-2 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t("title")}
        </h1>
        <h2 className="text-xl font-medium text-gray-700 sm:text-2xl">
          {t("ubication")}
        </h2>
      </header>

      {/* Información sobre CultureFit */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">          <Dumbbell className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("eliteTraining.title")}</h3>
          <p className="text-sm text-gray-600">
            {t("eliteTraining.description")}
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <Users className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("professionalCare.title")}</h3>
          <p className="text-sm text-gray-600">
            {t("professionalCare.description")}
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <Globe className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("globalAccess.title")}</h3>
          <p className="text-sm text-gray-600">
            {t("globalAccess.description")}
          </p>
        </div>
      </motion.div>

      {/* Mapa */}
      <motion.div
        className="w-full max-w-5xl relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <MapContainer
          center={[42.4390, -8.6919]}
          zoom={18}
          className="h-[400px] rounded-xl shadow-md overflow-hidden"
          attributionControl={false}
        >
          <TileLayer
            url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gKJKSFJEZfMAAS1eLraY1gTLsV7NKuosbvKrfwSsJH5ZHHl24sRaTiM9pMjzhtG1"
          />

          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.geocode}
              icon={customIcon}
              title={t("gymName")}
            >
              <Popup>{t("gymName")}</Popup>
            </Marker>
          ))}

          <GeoJSON
            data={gymData}
            style={{ color: "orange", weight: 2, fillOpacity: 0.4 }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
              }
            }}
          />

          <InvalidateMapSize />
        </MapContainer>


      </motion.div>
    </section>
  );
}

export default AboutUs;
