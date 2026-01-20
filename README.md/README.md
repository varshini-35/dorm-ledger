🏨 Dorm Ledger – Smart Hostel Management System

📌 Problem Statement

Most hostels still rely on manual registers and guesswork for meal planning, attendance, and student movement. This leads to food wastage, poor record keeping, lack of transparency, and no data-driven decision making.

There is no smart, centralized, data-driven hostel management system that optimizes resources efficiently.


---

💡 Our Solution

Dorm Ledger is a smart hostel management platform that digitizes student data, meal attendance, and gate pass tracking.
It integrates machine learning to predict the next day’s mess meal requirement, helping hostels reduce food wastage and optimize grocery planning.

The system is fully hosted, scalable, and built using modern web and cloud technologies.


---

🌐 Live Demo

🔗 Hosted Website:
https://dorm-ledger.vercel.app/

********Demo Login Credentials*******
Student Login (Demo Accounts)
USN:
1DA23CS001
1DA23CS002
1DA23CS003

Password:
Any value (prototype authentication)

Admin Login
Email:
test@drait.edu.in

Password:
Any value (prototype authentication)


// Authentication Note
User identity is verified using database records (USN / College Email).
Password validation is planned as part of the production hardening phase.


---

🧠 Machine Learning Integration

Model Used: Linear Regression
Purpose: Predict next day’s breakfast, lunch, and dinner count
Data: Daily historical meal attendance

Behavior:
Model is retrained/updated daily
Predictions improve as more data is collected

Impact:
Reduces food wastage
Saves grocery costs
Enables data-driven mess planning


---

🛠️ Tech Stack

--Frontend
HTML
CSS
JavaScript

--Backend
Node.js
Express.js

--Database
Firebase Firestore

--Machine Learning
Python
Scikit-learn (Linear Regression)

--Google Technologies Used
Firebase
Firebase Firestore
Firebase Admin SDK
Google Cloud Platform

---

🧩 Project Structure

dorm-ledger/
├── admin/      # Admin-side interface and management features
├── student/    # Student-side interface and functionalities
├── login/      # Authentication and login pages
├── splash/     # Landing page
├── backend/    # Server-side logic and APIs
├── ml/         # Machine learning services
├── README.md
└── .gitignore


---

⚠️ Branch Information

> Note:
The latest stable and fully working implementation of this project is available in the new branch.


---

▶️ How to Run the Project (Local Setup – Optional)

✅ Current Status

Backend is already hosted
Frontend works directly via hosted APIs
No local backend setup required to view the demo


---

🔧 Optional: Run Locally (For Developers)

Backend:

cd backend
npm install
npx nodemon src/index.js

Frontend:

Open /splash/index.html
Use Live Server / Go Live option


ML Service:

cd ml
pip install -r requirements.txt
python ml_service.py


---

🎯 Key Features

-Student authentication
-Daily meal attendance tracking
-Meal cut-off time enforcement
-Gate pass (IN/OUT) management
-Duplicate meal entry prevention
-ML-based next day meal prediction
-Data-driven decision making for hostels



---

🚀 Impact

-Reduces food wastage
-Saves operational and grocery costs
-Improves transparency and accountability
-Enables smart hostel management using AI



---

👥 Team


Frontend: Varshini
Backend : Pavithra Chakravarthy
ML: Yashaswini NS



---

🙏 Thank You

Thank you for taking the time to explore Dorm Ledger.
We believe smart data and AI can transform everyday systems — even hostels.

