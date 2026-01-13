const { db } = require("../config/firebase");

// CREATE DORM
exports.createDorm = async (req, res) => {
  try {
    const { name, floors, totalRooms } = req.body;

    if (!name || !floors || !totalRooms) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const dormRef = await db.collection("dorms").add({
      name,
      floors,
      totalRooms,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      dormId: dormRef.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create dorm" });
  }
};

// GET ALL DORMS
exports.getAllDorms = async (req, res) => {
  try {
    const snapshot = await db.collection("dorms").get();

    const dorms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(dorms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dorms" });
  }
};

// GET SINGLE DORM
exports.getDormById = async (req, res) => {
  try {
    const dormId = req.params.id;
    const dormDoc = await db.collection("dorms").doc(dormId).get();

    if (!dormDoc.exists) {
      return res.status(404).json({ message: "Dorm not found" });
    }

    res.json({
      id: dormDoc.id,
      ...dormDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dorm" });
  }
};
