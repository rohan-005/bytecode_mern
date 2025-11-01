🚀 ByteCode: Interactive & Gamified Learning Platform

ByteCode is a full-stack, interactive learning platform designed to help users learn programming languages through structured courses, real-time code execution, and a gamified progress system.
Built on the MERN Stack (MongoDB, Express, React, Node.js), ByteCode brings the classroom to your browser with a modern, intuitive, and playful interface.


Link: - https://bytecode.vercel.app

🌟 Overview

ByteCode transforms traditional coding tutorials into interactive learning journeys.
Users can explore structured courses, practice directly in the browser, earn XP, and track their progress across multiple programming languages — from HTML, CSS, and JavaScript to C, C++, Python, and Java.

✨ Features
🧠 Learning & Content

Structured Courses: Organized into modules like HTML Complete Guide, CSS Layouts, and JavaScript Fundamentals.
Categorized under Web Development and Programming tracks.

Interactive Exercises: Each course includes hands-on coding challenges with:

Objectives

Starter code

Solution code

Difficulty levels (Easy, Medium, Hard)

Gamified XP System:

Earn XP as you complete exercises:

🟢 Easy → 10 XP

🟡 Medium → 25 XP

🔴 Hard → 50 XP

Level up as you learn!

Progress Tracking:
Monitor your enrolled courses, completed lessons, and overall progress percentage.

⚙️ Core Technology

🧩 Live Code Execution:
Execute code in multiple languages via the backend /api/code/execute endpoint — supporting C, C++, Python, and Java.

🔐 Authentication & Security:

JWT-based login system.

Password hashing with bcryptjs.

Input sanitization using express-validator.

📧 OTP Verification & Password Reset:
Email-based 6-digit OTP system for secure registration and password recovery.

👤 User Profiles:
Track XP, levels, course enrollments, and completion stats — all in one dashboard.

💻 Frontend Experience

Built with React + Vite for blazing-fast performance.

Styled using Tailwind CSS with Framer Motion and GSAP for elegant animations.

Includes:

Dynamic Dashboard

Integrated Code Editor using @monaco-editor/react

Placeholder modules like ByteAI and DevDen (Coming Soon)

🛠️ Tech Stack
Backend (/backend)
Technology	Purpose
Node.js	Runtime Environment
Express.js	Web Framework
MongoDB + Mongoose	Database & ODM
JWT & bcryptjs	Authentication & Password Security
express-validator	Input Validation
Nodemailer / Resend API	Email Services (OTP Delivery)
Frontend (/frontend)
Technology	Purpose
React (v19.1.1)	Frontend Framework
Vite	Development Build Tool
Tailwind CSS	Styling
Framer Motion, GSAP	Animations
@monaco-editor/react	In-browser Code Editor
⚡ Getting Started
✅ Prerequisites

Ensure you have the following installed:

Node.js
 ≥ v18

npm or yarn

MongoDB
 (local or cloud instance)



🧩 Installation
1. Clone the Repository
git clone https://github.com/rohan-005/bytecode_mern.git
cd bytecode_mern

2. Install Root Dependencies
npm install

3. Install Backend Dependencies
cd backend
npm install

4. Install Frontend Dependencies
cd ../frontend
npm install

⚙️ Environment Configuration

Create a .env file inside the backend/ directory and configure the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173


(Ensure .env is listed in .gitignore)

🚀 Running the Application

From the project root directory:

npm run dev


This command runs both servers concurrently:

Backend → http://localhost:5000

Frontend → http://localhost:5173

Once started, the terminal should confirm:

✅ Server connected to MongoDB
🌐 Backend running on port 5000

📁 Project Structure
bytecode_mern/
├── backend/
│   ├── config/
│   │   └── connectdb.js
│   ├── courses/              # JSON-based course content
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── UserCourse.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── code.js
│   │   └── courseProgress.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── fonts/
│   │   └── logos/
│   ├── src/
│   │   ├── auth/
│   │   ├── byteai/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── pages/
│   └── vite.config.js
│
└── package.json

🧑‍💻 Developer Notes

The backend uses a modular architecture — each feature (auth, code execution, course progress) lives in its own route and model.

The frontend uses context-based authentication with persistent user sessions.

Code execution endpoints rely on system-level compilers, so ensure your server supports them.

🧩 Future Enhancements

🧠 ByteAI – AI-based code helper for instant hints & explanations.

🏆 Leaderboards – Rank learners based on XP and completion.

💬 Discussion Forums – Engage in topic-specific Q&A threads.

📊 Admin Dashboard – Manage courses, users, and content.

🤝 Contributing

Contributions are welcome!
To get started:

Fork this repository

Create a feature branch:

git checkout -b feature/your-feature


Commit your changes:

git commit -m "Add new feature"


Push to your branch:

git push origin feature/your-feature


Submit a Pull Request 🎉

🛡️ License

This project is licensed under the MIT License — feel free to use and modify for educational or personal purposes.

📬 Contact

Project Maintainer: Frosthowl
📧 Email: rohandhanerwal@gmail.com
]
🌐 GitHub: github.com/rohan-005