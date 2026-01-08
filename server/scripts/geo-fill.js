// server/utils/geoFill.js
import axios from "axios";
import Item from "../models/Car.js";

export const fillMissingCoords = async () => {
  const items = await Item.find({ $or: [{ locationCoords: null }, { locationCoords: { $exists: false } }] });

  for (const item of items) {
    if (!item.location) continue;
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: item.location,
          format: "json",
          limit: 1,
        },
        headers: { "User-Agent": "CarRentalApp/1.0 (your_email@example.com)" }
      });

      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        item.locationCoords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        await item.save();
        console.log(`✅ Updated ${item.brand} ${item.model}: ${lat}, ${lon}`);
      } else {
        console.log(`⚠️ No coordinates found for ${item.location}`);
      }
    } catch (err) {
      console.error(`Error for ${item.location}:`, err.message);
    }
  }

  console.log("🌍 GeoFill completed!");
};















// // server/scripts/geo-fill.js
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import fetch from 'node-fetch';
// import Item from '../models/Car.js'; // path adjust

// dotenv.config();
// await mongoose.connect(process.env.MONGO_URI, {});

// const GEOCODE_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

// const geocode = async (address) => {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODE_KEY}`;
//   const res = await fetch(url);
//   const j = await res.json();
//   if (j.status === 'OK' && j.results && j.results.length) {
//     const loc = j.results[0].geometry.location;
//     return { lat: loc.lat, lng: loc.lng };
//   }
//   return null;
// };

// (async () => {
//   try {
//     const items = await Item.find({ $or: [{ locationCoords: { $exists: false } }, { locationCoords: null }] }).limit(200);
//     for (const it of items) {
//       if (!it.location) continue;
//       console.log('Geocoding', it._id, it.location);
//       const coords = await geocode(it.location);
//       if (coords) {
//         it.locationCoords = coords;
//         await it.save();
//         console.log('Saved coords for', it._id);
//       } else {
//         console.log('No coords for', it._id);
//       }
//       // Don't hammer API—sleep 200ms
//       await new Promise(r => setTimeout(r, 200));
//     }
//     console.log('Done');
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// })();
