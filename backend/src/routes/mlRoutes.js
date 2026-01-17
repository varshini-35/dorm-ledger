const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict-meals", async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;

    const response = await axios.post("http://127.0.0.1:5001/predict", {
      breakfast,
      lunch,
      dinner
    });

    res.json({
      success: true,
      predictedMeals: response.data.predictedMeals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ML Server not responding" });
  }
});

module.exports = router;