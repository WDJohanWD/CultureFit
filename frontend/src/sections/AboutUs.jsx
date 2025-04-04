import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
function AboutUs() {

  const { t } = useTranslation("aboutus");

    const markers = [
        {
            geocode: [42.242879, -8.696784],
            popUp: "CultureFit"
        }
    ]
    const customIcon = new Icon({
        iconUrl: "Mark.png",
        iconSize: [45, 40]
    })
    return (
        <>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl text-center">{t("title")}</h1>
            <h2 className="text-xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl text-center" >{t("ubication")}</h2>
            <MapContainer center={[42.242794462547636, -8.696215562890764]} zoom={15} style={{ height: "400px" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.jawg.io">Jawg</a>'
                    url="https://tile.jawg.io/35e6ff0b-cb69-4fa9-9e05-6606986d694d/{z}/{x}/{y}{r}.png?access-token=gKJKSFJEZfMAAS1eLraY1gTLsV7NKuosbvKrfwSsJH5ZHHl24sRaTiM9pMjzhtG1"
                    zoom={30 }
                />


                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.geocode} icon={customIcon}>
                        <Popup>{marker.popUp}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    )

}

export default AboutUs;