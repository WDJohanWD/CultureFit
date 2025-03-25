import { MapContainer, TileLayer, Marker, } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"; 
function PaginaQuienesSomos(){

    const markers =[
        {
            geocode: [42.242879, -8.696784],
            popUp: "Aquí estamos"
        }
    ]
    const customIcon = new Icon({
        iconUrl:"CultureFitLogoNegro.png",
        iconSize: [40,40]
    })
    return(
        <>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl text-center">Quienes somos</h1>

            <MapContainer center={[42.242794462547636, -8.696215562890764]} zoom={15} style={{height: "400px"}}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMaps</a> Contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.geocode} icon={customIcon}>
                    </Marker>
                ))}
            </MapContainer>
        </>
    ) 

}

export default PaginaQuienesSomos;