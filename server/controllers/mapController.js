import User from "../models/User.js";
import fetch from "node-fetch"; // make sure you install it → npm i node-fetch


// Function to get vendors with coordinates
export const getMapVendors = async (req, res) => {
  try {
    const vendors = await User.find(
      { role: "owner", "vendorProfile.shopCoords.lat": { $exists: true } },
      "name email vendorProfile"
    ).lean();

    res.json({ success: true, vendors });
  } catch (err) {
    console.error("Error fetching vendor map data:", err);
    res.status(500).json({ success: false, message: "Server error fetching vendors." });
  }
};

// Optional helper: geocode address if missing coordinates
export const geocodeVendorAddress = async (address) => {
  if (!address) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
};

// Optional route: Update vendor coordinates manually
export const updateVendorCoords = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { lat, lng } = req.body;

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "owner") {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    vendor.vendorProfile.shopCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    await vendor.save();

    res.json({ success: true, message: "Vendor coordinates updated", vendor });
  } catch (err) {
    console.error("Error updating vendor coords:", err);
    res.status(500).json({ success: false, message: "Server error updating vendor coords." });
  }
};















// import Item from "../models/Car.js";
// import axios from "axios";

// import fetch from 'node-fetch';

// export const geocodeLocation = async (address) => {
//   if (!address) return null;
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//   try {
//     const res = await fetch(url);
//     const data = await res.json();
//     if (data && data.length > 0) {
//       return {
//         lat: parseFloat(data[0].lat),
//         lng: parseFloat(data[0].lon),
//       };
//     }
//     return null;
//   } catch (err) {
//     console.error('Geocode failed:', err);
//     return null;
//   }
// };


// // GET /api/maps/items
// export const getMapItems = async (req, res) => {
//   try {
//     // 1️⃣ Fetch all items that might have or lack coords
//     const items = await Item.find({}, {
//       brand: 1,
//       model: 1,
//       type: 1,
//       location: 1,
//       image: 1,
//       pricePerDay: 1,
//       vendor: 1,
//       locationCoords: 1,
//     }).lean();

//     // 2️⃣ Prepare an array to store items with missing coords
//     const missingCoords = items.filter(it => !it.locationCoords && it.location);

//     // 3️⃣ For each missing coord, fetch from Google Maps Geocoding API
//     const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
//     if (GOOGLE_KEY && missingCoords.length > 0) {
//       for (const item of missingCoords) {
//         try {
//           const geoRes = await axios.get(
//             `https://maps.googleapis.com/maps/api/geocode/json`,
//             {
//               params: {
//                 address: item.location,
//                 key: GOOGLE_KEY,
//               },
//             }
//           );

//           const loc = geoRes.data.results[0]?.geometry?.location;
//           if (loc) {
//             // Update DB so next time it’s cached
//             await Item.findByIdAndUpdate(item._id, {
//               locationCoords: loc,
//             });
//             // Update local copy
//             item.locationCoords = loc;
//           }
//         } catch (geoErr) {
//           console.warn(`❌ Geocoding failed for ${item.location}:`, geoErr.message);
//         }
//       }
//     }

//     // 4️⃣ Normalize response — always ensure `locationCoords` exists
//     const normalized = items.map(it => ({
//       ...it,
//       locationCoords: it.locationCoords || null,
//     }));

//     res.json({ success: true, items: normalized });
//   } catch (err) {
//     console.error("getMapItems error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error fetching map items.",
//     });
//   }
// };

// // PUT /api/maps/item/:itemId/coords
// export const updateItemCoords = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { lat, lng } = req.body;
//     if (!lat || !lng)
//       return res
//         .status(400)
//         .json({ success: false, message: "Lat and Lng required" });

//     const item = await Item.findById(itemId);
//     if (!item)
//       return res
//         .status(404)
//         .json({ success: false, message: "Item not found" });

//     item.locationCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
//     await item.save();

//     res.json({ success: true, message: "Coords updated", item });
//   } catch (err) {
//     console.error("updateItemCoords:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


















// // import Item from "../models/Car.js"; // or Item model path

// // // GET /api/maps/items
// // export const getMapItems = async (req, res) => {
// //   try {
// //     // Fetch items that have location coordinates or that have address we can geocode later
// //     // We'll return relevant fields only
// //     const items = await Item.find({}, {
// //       brand: 1, model: 1, type: 1, location: 1, image: 1, pricePerDay: 1, vendor: 1, locationCoords: 1
// //     }).lean();

// //     // Normalize: ensure coords property exists as locationCoords {lat,lng}
// //     const normalized = items.map(it => {
// //       return {
// //         ...it,
// //         locationCoords: it.locationCoords || null
// //       };
// //     });

// //     res.json({ success: true, items: normalized });
// //   } catch (err) {
// //     console.error("getMapItems error:", err);
// //     res.status(500).json({ success: false, message: "Server error fetching map items." });
// //   }
// // };


// // // endpoint to update coords for a single item

// // export const updateItemCoords = async (req, res) => {
// //   try {
// //     const { itemId } = req.params;
// //     const { lat, lng } = req.body;
// //     if (!lat || !lng) return res.status(400).json({ success: false, message: "Lat and Lng required" });

// //     const item = await Item.findById(itemId);
// //     if (!item) return res.status(404).json({ success: false, message: "Item not found" });

// //     item.locationCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
// //     await item.save();
// //     res.json({ success: true, message: "Coords updated", item });
// //   } catch (err) {
// //     console.error("updateItemCoords:", err);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };
