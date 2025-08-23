import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
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

const customIconPerson = new Icon({
  iconUrl: "/PersonMark.svg",
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

function RoutingButton({ userPosition, destination }) {
  const map = useMap();
  const [routeControl, setRouteControl] = useState(null);

  const handleRouting = () => {
    if (!userPosition) return;

    if (routeControl) {
      map.removeControl(routeControl);
    }

    const L = window.L;
    if (!L || !L.Routing) {
      console.error("Leaflet Routing Machine is not loaded.");
      return;
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userPosition[0], userPosition[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    if (control._container) {
      control._container.style.display = "none";
    }

    setRouteControl(control);
  };

  return (
    <button
      onClick={handleRouting}
      className="absolute top-2 right-2 z-[1000] bg-orange-500 text-white px-3 py-2 rounded-lg shadow hover:bg-orange-600"
    >
      Cómo llegar
    </button>
  );
}

function AboutUs() {
  const { t } = useTranslation("aboutus");
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

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

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <Dumbbell className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("eliteTraining.title")}</h3>
          <p className="text-sm text-gray-600">{t("eliteTraining.description")}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <Users className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("professionalCare.title")}</h3>
          <p className="text-sm text-gray-600">{t("professionalCare.description")}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <Globe className="w-10 h-10 text-orange-500" />
          <h3 className="font-semibold text-lg">{t("globalAccess.title")}</h3>
          <p className="text-sm text-gray-600">{t("globalAccess.description")}</p>
        </div>
      </motion.div>

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
          <TileLayer url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gKJKSFJEZfMAAS1eLraY1gTLsV7NKuosbvKrfwSsJH5ZHHl24sRaTiM9pMjzhtG1" />

          {userPosition && (
            <Marker position={userPosition} icon={customIconPerson}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          )}

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

          <RoutingButton
            userPosition={userPosition}
            destination={markers[0].geocode}
          />
        </MapContainer>
      </motion.div>
    </section>
  );
}

export default AboutUs;
