import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CarCard from "../components/CarCard";

const VendorServices = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/owner/vendor/${id}`);

        if (data.success) {
          // ✅ IMPORTANT FIX
          const vendorProfile = data.vendor.vendorProfile;

          setVendor(vendorProfile);

          // 🔥 Convert services to CarCard-compatible format
          const mappedServices = data.services.map(service => ({
            ...service,
            pricePerDay: service.pricePerDay,
            images: service.images || [],
            location: vendorProfile.city,
            category: service.category || service.type,
            vendor: {
              storeName: vendorProfile.storeName,
              address: vendorProfile.address,
            }
          }));

          setServices(mappedServices);
        }
      } catch (error) {
        console.error("Error loading vendor services", error);
      }
    };

    fetchData();
  }, [id]);

  if (!vendor) {
    return <p className="text-center mt-24">Loading vendor details...</p>;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-28">

      {/* ✅ Vendor Header */}
      <div className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-bold text-gray-900">
         Store: {vendor.storeName}
        </h1>

        <p className="text-gray-600 mt-1">
          Address: {vendor.address}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {vendor.city}, {vendor.state}
        </p>
      </div>

      {/* ✅ Services */}
      {services.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No services available from this vendor.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, index) => (
            <CarCard key={item._id || index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorServices;














// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const VendorServices = () => {
//   const { id } = useParams();
//   const [vendor, setVendor] = useState(null);
//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//        // const { data } = await axios.get(`/api/owner/vendor/${id}`);
//        const { data } = await axios.get(`/api/owner/vendor/${id}`);

//         if (data.success) {
//           setVendor(data.vendor);
//           setServices(data.services);
//         }
//       } catch (error) {
//         console.error("Error loading vendor services", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!vendor) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold mb-4">{vendor.storeName}</h1>
//       <p className="text-gray-600">{vendor.address}</p>

//       <h2 className="text-2xl font-bold mt-6">Services Offered</h2>

//       {services.length === 0 ? (
//         <p className="text-gray-500 mt-2">No services available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//           {services.map((item) => (
//             <div key={item._id} className="border p-4 rounded-lg shadow-sm">
//               <h3 className="font-semibold text-lg">{item.name}</h3>
//               <p className="text-gray-600">{item.description}</p>
//               <p className="font-medium mt-2">Price: ₹{item.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorServices;
