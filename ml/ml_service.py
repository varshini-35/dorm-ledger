from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Dummy training data
X = np.array([
    [1, 1, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 1]
])

y = np.array([120, 90, 100, 80, 50])

model = LinearRegression()
model.fit(X, y)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    breakfast = 1 if data.gpet("breakfast", False) else 0
    lunch = 1 if data.get("lunch", False) else 0
    dinner = 1 if data.get("dinner", False) else 0

    prediction = model.predict([[breakfast, lunch, dinner]])

    return jsonify({
        "predictedMeals": int(prediction[0])
    })

if __name__ == "__main__":
    app.run(port=5001)