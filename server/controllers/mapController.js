import Item from "../models/Car.js"; // or Item model path

// GET /api/maps/items
export const getMapItems = async (req, res) => {
  try {
    // Fetch items that have location coordinates or that have address we can geocode later
    // We'll return relevant fields only
    const items = await Item.find({}, {
      brand: 1, model: 1, type: 1, location: 1, image: 1, pricePerDay: 1, vendor: 1, locationCoords: 1
    }).lean();

    // Normalize: ensure coords property exists as locationCoords {lat,lng}
    const normalized = items.map(it => {
      return {
        ...it,
        locationCoords: it.locationCoords || null
      };
    });

    res.json({ success: true, items: normalized });
  } catch (err) {
    console.error("getMapItems error:", err);
    res.status(500).json({ success: false, message: "Server error fetching map items." });
  }
};


// endpoint to update coords for a single item

export const updateItemCoords = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ success: false, message: "Lat and Lng required" });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.locationCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    await item.save();
    res.json({ success: true, message: "Coords updated", item });
  } catch (err) {
    console.error("updateItemCoords:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
