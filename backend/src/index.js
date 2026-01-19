const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Firebase Admin Init ----------------
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});



const db = admin.firestore();

// ---------------- ADMIN LOGIN API ----------------
app.post("/auth/admin/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return res.json({ success: true, uid: userRecord.uid, role: "admin" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Admin does not exist" });
  }
});

app.post("/auth/admin/verify", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "Token required" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const adminEmails = ["admin1@college.edu", "admin2@college.edu"];
    if (!adminEmails.includes(decoded.email)) {
      return res.status(401).json({ success: false, message: "Not an admin" });
    }
    return res.json({ success: true, uid: decoded.uid, email: decoded.email });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ---------------- STUDENT INFO (LOGIN + PROFILE) ----------------
app.get("/users/:usn", async (req, res) => {
  const usn = req.params.usn.trim().toUpperCase();

  try {
    const snapshot = await db
      .collection("users")
      .where("usn", "==", usn)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return res.json({
      success: true,
      student: {
        id: doc.id,
        name: data.name,
        usn: data.usn,
        room: data.room,
        phone: data.phone,
        //password: data.password   // ⚠️ temp (ok for now)
      }
    });

  } catch (err) {
    console.error("Fetch student error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Add a student
app.post("/users", async (req, res) => {
  const { studentId, name, usn, room, phone, password } = req.body;
  if (!studentId || !name || !usn || !room || !phone ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const docRef = db.collection("users").doc(studentId);
    await docRef.set({ studentId, name, usn: usn.toUpperCase(), room, phone });
    res.json({ success: true, studentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add student" });
  }
});

// ---------------- OTHER APIs ----------------
// DORM, ROOMS, Electricity, Water, Meals, Ledger, Dashboard remain unchanged
// Copy everything from your existing index.js here for other routes
// ---------------- DORM APIs ----------------
app.post("/dorms", async (req, res) => {
  const { name, totalRooms, floors } = req.body;
  try {
    const docRef = await db.collection("dorms").add({ name, totalRooms, floors });
    res.json({ success: true, dorm: { id: docRef.id, name, totalRooms, floors } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/dorms", async (req, res) => {
  try {
    const snapshot = await db.collection("dorms").get();
    const dorms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ dorms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/dorms/:id", async (req, res) => {
  try {
    const doc = await db.collection("dorms").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: "Dorm not found" });
    res.json({ dorm: { id: doc.id, ...doc.data() } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- ROOM APIs ----------------
app.post("/rooms", async (req, res) => {
  const { dormId, roomNumber, type } = req.body;
  try {
    const dormDoc = await db.collection("dorms").doc(dormId).get();
    if (!dormDoc.exists) return res.status(404).json({ success: false, message: "Dorm not found" });

    const docRef = await db.collection("rooms").add({ dormId, roomNumber, type });
    res.json({ success: true, room: { id: docRef.id, dormId, roomNumber, type } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/rooms", async (req, res) => {
  const { dormId } = req.query;
  try {
    let query = db.collection("rooms");
    if (dormId) query = query.where("dormId", "==", dormId);

    const snapshot = await query.get();
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- ELECTRICITY USAGE ----------------
app.post("/electricity/usage", async (req, res) => {
  const { roomId, units, date } = req.body;
  try {
    const docRef = await db.collection("electricityUsage").add({ roomId, units, date });
    res.json({ success: true, usage: { id: docRef.id, roomId, units, date } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/electricity/usage", async (req, res) => {
  const { roomId } = req.query;
  try {
    let query = db.collection("electricityUsage");
    if (roomId) query = query.where("roomId", "==", roomId);

    const snapshot = await query.get();
    const usage = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ usage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- WATER USAGE ----------------
app.post("/water/usage", async (req, res) => {
  const { roomId, liters, date } = req.body;
  try {
    const docRef = await db.collection("waterUsage").add({ roomId, liters, date });
    res.json({ success: true, usage: { id: docRef.id, roomId, liters, date } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/water/usage", async (req, res) => {
  const { roomId } = req.query;
  try {
    let query = db.collection("waterUsage");
    if (roomId) query = query.where("roomId", "==", roomId);

    const snapshot = await query.get();
    const usage = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ usage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// ---------------- GET MEAL ATTENDANCE STATUS ----------------
app.get("/meals/attendance/:usn/:date", async (req, res) => {
  const { usn, date } = req.params;

  try {
    // Find student
    const userSnap = await db
      .collection("users")
      .where("usn", "==", usn.toUpperCase())
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentId = userSnap.docs[0].id;

    // Check meal record
    const mealSnap = await db
      .collection("mealResponses")
      .where("studentId", "==", studentId)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (mealSnap.empty) {
      return res.json({
        success: true,
        submitted: false,
      });
    }

    return res.json({
      success: true,
      submitted: true,
      data: mealSnap.docs[0].data(),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meal status",
    });
  }
});


// ---------------- MEAL ATTENDANCE ----------------
app.post("/meals/attendance", async (req, res) => {
  const { usn, breakfast, lunch, dinner, date } = req.body;

  try {
    // Find student
    const userSnap = await db
      .collection("users")
      .where("usn", "==", usn.toUpperCase())
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const student = userSnap.docs[0];

    // Check if a meal record for this student on this date already exists
    const mealSnap = await db
      .collection("mealResponses")
      .where("studentId", "==", student.id)
      .where("date", "==", date)
      .limit(1)
      .get();

    if (!mealSnap.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Meal already recorded for this date" });
    }

    // Add meal record
    await db.collection("mealResponses").add({
      studentId: student.id,
      usn: usn.toUpperCase(),
      breakfast,
      lunch,
      dinner,
      date,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: "Meal recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving meal" });
  }
});

// ---------------- MEAL SUMMARY (FOR ML) ----------------
app.get("/meals/summary", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "date query parameter is required"
    });
  }

  try {
    const db = admin.firestore();
    const snapshot = await db
      .collection("mealResponses")
      .where("date", "==", date)
      .get();

    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.breakfast) breakfastCount++;
      if (data.lunch) lunchCount++;
      if (data.dinner) dinnerCount++;
    });

    return res.json({
      date,
      breakfastCount,
      lunchCount,
      dinnerCount,
      totalResponses: snapshot.size
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch summary" });
  }
});
// ---------------- LEDGER ----------------
app.post("/ledger/entry", async (req, res) => {
  const { type, amount, roomId, date } = req.body;
  try {
    const docRef = await db.collection("ledger").add({ type, amount, roomId, date });
    res.json({ success: true, entry: { id: docRef.id, type, amount, roomId, date } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get ledger entries for a specific room
app.get("/ledger/room/:roomId", async (req, res) => {
  try {
    const snapshot = await db.collection("ledger").where("roomId", "==", req.params.roomId).get();
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get ledger entries for a dorm
app.get("/ledger/dorm/:dormId", async (req, res) => {
  try {
    // Find all rooms in the dorm
    const roomSnapshot = await db.collection("rooms").where("dormId", "==", req.params.dormId).get();
    const roomIds = roomSnapshot.docs.map(doc => doc.id);

    if (roomIds.length === 0) return res.json({ entries: [] });

    // Get all ledger entries for these rooms
    const ledgerSnapshot = await db.collection("ledger")
      .where("roomId", "in", roomIds)
      .get();

    const entries = ledgerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ledger summary (total per type)
app.get("/ledger/summary", async (req, res) => {
  try {
    const snapshot = await db.collection("ledger").get();
    const summary = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      summary[data.type] = (summary[data.type] || 0) + data.amount;
    });
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- DASHBOARD ----------------
app.get("/dashboard/overview", async (req, res) => {
  try {
    const dormSnapshot = await db.collection("dorms").get();
    const roomsSnapshot = await db.collection("rooms").get();
    const electricitySnapshot = await db.collection("electricityUsage").get();
    const waterSnapshot = await db.collection("waterUsage").get();

    const totalDorms = dormSnapshot.size;
    const totalRooms = roomsSnapshot.size;
    const totalElectricity = electricitySnapshot.docs.reduce((sum, doc) => sum + doc.data().units, 0);
    const totalWater = waterSnapshot.docs.reduce((sum, doc) => sum + doc.data().liters, 0);

    res.json({ totalDorms, totalRooms, totalElectricity, totalWater });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/dashboard/alerts", async (req, res) => {
  try {
    const electricitySnapshot = await db.collection("electricityUsage").get();
    const waterSnapshot = await db.collection("waterUsage").get();

    const highElectricity = electricitySnapshot.docs
      .filter(doc => doc.data().units > 50)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    const highWater = waterSnapshot.docs
      .filter(doc => doc.data().liters > 500)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ highElectricity, highWater });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get student info
app.get("/student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // TEMP: Fetch from Firestore
    const doc = await admin.firestore().collection("users").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.json({ success: true, student: doc.data() });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Dorm Ledger Backend Running 🚀");
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});