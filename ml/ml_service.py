# ml/ml_service.py

import numpy as np
from sklearn.linear_model import LinearRegression

# -------------------------------
# 1️⃣ Historical dummy data
# -------------------------------
# Columns: [Total Students, Breakfast %, Lunch %, Dinner %]
X = np.array([
    [120, 0.80, 0.85, 0.82],
    [120, 0.75, 0.82, 0.80],
    [120, 0.78, 0.88, 0.84],
    [120, 0.82, 0.86, 0.83],
    [120, 0.76, 0.80, 0.78]
])

# Outputs: actual meal counts [breakfast_count, lunch_count, dinner_count]
y = np.array([
    [96, 102, 98],
    [90, 98, 96],
    [94, 106, 101],
    [98, 103, 100],
    [91, 96, 94]
])

# -------------------------------
# 2️⃣ Input today's attendance (can be modified)
# -------------------------------
# Example: 120 students, 78% breakfast, 85% lunch, 82% dinner
today_X = np.array([[120, 0.78, 0.85, 0.82]])
today_y = np.array([[94, 102, 99]])  # actual counts for today

# -------------------------------
# 2a️⃣ Print today's summary
# -------------------------------
print("Input (Today's Summary)")
print(f"Total Students : {int(today_X[0][0])}")
print(f"Breakfast %    : {today_X[0][1]:.2f}")
print(f"Lunch %        : {today_X[0][2]:.2f}")
print(f"Dinner %       : {today_X[0][3]:.2f}\n")

# Append today's data to historical data
X = np.vstack([X, today_X])
y = np.vstack([y, today_y])

# -------------------------------
# 3️⃣ Train model
# -------------------------------
model = LinearRegression()
model.fit(X, y)

print("Model trained on historical + today's data.\n")

# -------------------------------
# 4️⃣ Predict tomorrow's meal counts
# -------------------------------
# For simplicity, assume same % as today for tomorrow
tomorrow_X = np.array([[120, 0.78, 0.85, 0.82]])

predicted_counts = model.predict(tomorrow_X)
predicted_counts = predicted_counts.round().astype(int)

print("Predicted meal counts for tomorrow:")
print(f"Breakfast: {predicted_counts[0][0]}")
print(f"Lunch:     {predicted_counts[0][1]}")
print(f"Dinner:    {predicted_counts[0][2]}")
