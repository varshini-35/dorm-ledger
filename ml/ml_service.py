from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# -----------------------------
# Health check (for demo)
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return "ML service is running"

# -----------------------------
# Dummy training data
# breakfast, lunch, dinner
# -----------------------------
X = np.array([
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
    [0, 0, 1]
])

y = np.array([120, 100, 90, 80, 50])

model = LinearRegression()
model.fit(X, y)

# -----------------------------
# Prediction API
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    breakfast = 1 if data.get("breakfast", False) else 0
    lunch = 1 if data.get("lunch", False) else 0
    dinner = 1 if data.get("dinner", False) else 0

    prediction = model.predict([[breakfast, lunch, dinner]])

    return jsonify({
        "predictedMeals": int(prediction[0])
    })

# -----------------------------
# Run ML server
# -----------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)