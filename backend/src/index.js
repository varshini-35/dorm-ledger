const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Firebase Admin Init ----------------
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

// ---------------- STUDENTS ----------------
app.post("/users", async (req, res) => {
  const { studentId, name, usn, room, phone, password } = req.body;
  if (!studentId || !name || !usn || !room || !phone || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await db.collection("users").doc(studentId).set({
      studentId,
      name,
      usn: usn.toUpperCase(),
      room,
      phone,
      password,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add student" });
  }
});

// ---------------- MEAL ATTENDANCE ----------------
app.post("/meals/attendance", async (req, res) => {
  const { usn, breakfast, lunch, dinner, date } = req.body;

  try {
    const userSnap = await db
      .collection("users")
      .where("usn", "==", usn.toUpperCase())
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const student = userSnap.docs[0];

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
    res.status(500).json({ success: false, message: "Error saving meal" });
  }
});

// ---------------- ML PREDICTION (🔥 INTEGRATED) ----------------
app.post("/ml/predict", async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;

    const mlResponse = await axios.post("http://127.0.0.1:5001/predict", {
      breakfast,
      lunch,
      dinner,
    });

    res.json({
      success: true,
      predictedMeals: mlResponse.data.predictedMeals,
    });
  } catch (error) {
    console.error("ML ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "ML service not reachable",
    });
  }
});

// ---------------- MEAL SUMMARY ----------------
app.get("/meals/summary", async (req, res) => {
  const { date } = req.query;

  const snapshot = await db.collection("mealResponses").where("date", "==", date).get();

  let breakfast = 0,
    lunch = 0,
    dinner = 0;

  snapshot.forEach(doc => {
    const d = doc.data();
    if (d.breakfast) breakfast++;
    if (d.lunch) lunch++;
    if (d.dinner) dinner++;
  });

  res.json({ breakfast, lunch, dinner, total: snapshot.size });
});

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Dorm Ledger Backend Running 🚀");
});

// ---------------- START SERVER ----------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});