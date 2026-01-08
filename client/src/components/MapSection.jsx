import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-markercluster";
//import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

const vendorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
});

/* 🔹 Component to move map */
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13);
  }, [position]);
  return null;
};

const MapSection = () => {
  const [vendors, setVendors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/maps/vendors").then(({ data }) => {
      if (data.success) setVendors(data.vendors);
    });
  }, []);

  /* 🔍 Search location */
  const handleSearch = async () => {
    if (!searchText) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`
    );
    const data = await res.json();

    if (data.length > 0) {
      setMapPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
  };

  /* 📍 Use user's location */
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setMapPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-10 px-6">

      {/* ================= LEFT: MAP ================= */}
      <div className="h-[500px] rounded-xl overflow-hidden shadow">
        <MapContainer
          center={mapPosition}
          zoom={5}
          className="h-full w-full"
        >
          <FlyToLocation position={mapPosition} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MarkerClusterGroup>
            {vendors.map(
              (v) =>
                v.vendorProfile?.shopCoords?.lat && (
                  <Marker
                    key={v._id}
                    position={[
                      v.vendorProfile.shopCoords.lat,
                      v.vendorProfile.shopCoords.lng,
                    ]}
                    icon={vendorIcon}
                  >
                    <Popup>
                      <h3 className="font-semibold">
                        {v.vendorProfile.storeName}
                      </h3>
                      <p className="text-sm">{v.vendorProfile.address}</p>
                      <button
                        onClick={() => navigate(`/vendor/${v._id}`)}
                        className="mt-2 bg-indigo-600 text-white px-3 py-2 rounded w-full"
                      >
                        View Services
                      </button>
                    </Popup>
                  </Marker>
                )
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* ================= RIGHT: SEARCH & LOCATION ================= */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Find Services Near You</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search city, area, or place"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white py-2 rounded-lg"
        >
          Search Location
        </button>

        <div className="text-center text-gray-400">OR</div>

        <button
          onClick={useMyLocation}
          className="border border-indigo-600 text-indigo-600 py-2 rounded-lg"
        >
          Use My Current Location
        </button>

        <p className="text-sm text-gray-500 mt-2">
          We’ll show vendors available near your selected location.
        </p>
      </div>
    </div>
  );
};

export default MapSection;













// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import L from "leaflet";
// import { useNavigate } from "react-router-dom";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";


// const MapSection = () => {
//   const [vendors, setVendors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const { data } = await axios.get("/api/maps/vendors");
//         if (data.success) setVendors(data.vendors);
//       } catch (err) {
//         console.error("Error fetching vendors:", err);
//       }
//     };
//     fetchVendors();
//   }, []);

//   const vendorIcon = new L.Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
//     iconSize: [35, 35],
//   });

//   return (
//     <div className="my-10">
//       <h2 className="text-2xl font-bold text-center mb-4"></h2>
//       <MapContainer
//         center={[20.5937, 78.9629]} // India center
//         zoom={5}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         <MarkerClusterGroup>
//         {vendors.map((v) => (
//           v.vendorProfile?.shopCoords?.lat && (
//             <Marker
//              key={v._id}
//                 position={[
//                 v.vendorProfile.shopCoords.lat,
//                 v.vendorProfile.shopCoords.lng,
//          ]}
//              icon={vendorIcon}
//             >
//            <Popup>
//             <div>
//              <h3 className="font-semibold text-lg">{v.vendorProfile.storeName}</h3>
//              <p>{v.vendorProfile.address}</p>
//              <p className="text-sm text-gray-600">
//             {v.vendorProfile.city}, {v.vendorProfile.state}
//                </p>

//           <button
//             // onClick={() => window.location.href = `/api/owner/vendor/${v._id}`}
//                onClick={() => navigate(`/vendor/${v._id}`)}
//            // onClick={() => window.location.href = `/vendor/${v._id}`}
//                className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-md w-full text-center"
//            >
//               View Services
//            </button>
//         </div>
//        </Popup>
//       </Marker>

//             // <Marker
//             //   key={v._id}
//             //   position={[
//             //     v.vendorProfile.shopCoords.lat,
//             //     v.vendorProfile.shopCoords.lng,
//             //   ]}
//             //   icon={vendorIcon}
//             // >
//             //   <Popup>
//             //     <div>
//             //       <h3 className="font-semibold text-lg">{v.vendorProfile.storeName}</h3>
//             //       <p>{v.vendorProfile.address}</p>
//             //       <p className="text-sm text-gray-600">
//             //         {v.vendorProfile.city}, {v.vendorProfile.state}
//             //       </p>
//             //     </div>
//             //   </Popup>
//             // </Marker>
//           )
//         ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapSection;