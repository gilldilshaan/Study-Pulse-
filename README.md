# 🚀 StudyPulse – Smart Student Productivity Dashboard

> A full-stack MERN-based productivity system designed to help students **track tasks, manage focus, analyze spending, and improve performance** through actionable insights.

---

## 📌 Overview

**StudyPulse** is a data-driven student productivity platform that combines:

* 📚 Task Management
* ⏱ Focus Tracking (Pomodoro-style sessions)
* 💰 Expense Tracking
* 📊 Intelligent Dashboard Analytics

The goal is simple:
➡️ **Turn raw activity into meaningful insights and better decisions.**

---

## 🧠 Core Features

### ✅ 1. Task Management

* Create, update, delete tasks
* Track completion status
* Weekly progress tracking (% completion)

### ⏱ 2. Focus Sessions

* Log study sessions (duration-based)
* Track total focus time
* Identify consistency patterns

### 💰 3. Finance Tracking

* Record income & expenses
* Categorize spending (Books, Food, etc.)
* Calculate net balance automatically

### 📊 4. Smart Dashboard

* Real-time analytics:

  * Tasks completed
  * Focus minutes
  * Weekly spending
* Visual charts (7-day trends)
* Insight engine:

  * “Top spending category”
  * “Task completion %”
* 🎯 **Next Best Action Suggestions**

### ⚡ 5. Productivity UX

* Keyboard shortcut: `Ctrl + K` (Quick Search - planned)
* Activity feed (daily logs)
* Smart tips & recommendations

---

## 🏗 Tech Stack

### Frontend

* HTML, CSS (Modular styling)
* Vanilla JavaScript (ES Modules)
* Chart.js (Data Visualization)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other

* REST APIs
* Session Storage (user session handling)

---

## 🧩 Project Structure

```
StudyPulse/
│
├── frontend/
│   ├── dashboard.html
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── polish.css
│   ├── js/
│   │   ├── main.js
│   │   ├── pages/
│   │   │   └── dashboard.js
│   │   └── utils/
│   │       └── storage.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── tasks.js
│   │   ├── transactions.js
│   │   └── focus.js
│   └── models/
│
└── README.md
```

---

## ⚙️ How It Works (High-Level)

### 🔁 Data Flow

1. Frontend loads dashboard
2. Retrieves `userId` from session
3. Calls APIs:

   * `/api/tasks/:userId`
   * `/api/transactions/:userId`
   * `/api/focus/:userId`
4. Backend fetches data from MongoDB
5. Frontend:

   * Processes data
   * Computes insights
   * Renders UI + charts

---

## 📊 Dashboard Logic

### Key Computations

* **Task Completion %**
* **Total Focus Time**
* **Income vs Expense**
* **Top Spending Category**
* **Weekly Trends (7 days)**

### Insight Engine

| Condition           | Output                  |
| ------------------- | ----------------------- |
| Low task completion | “Finish pending tasks”  |
| High expenses       | “Reduce spending”       |
| Low focus time      | “Start a focus session” |
| Balanced            | “Keep the momentum”     |

---

## 📡 API Endpoints

### Tasks

```
GET /api/tasks/:userId
```

### Transactions

```
GET /api/transactions/:userId
```

### Focus Sessions

```
GET /api/focus/:userId
```

---

## 🗃 Data Models

### Task

```json
{
  "title": "Study DSA",
  "completed": true,
  "createdAt": "Date"
}
```

### Transaction

```json
{
  "type": "expense",
  "amount": 500,
  "category": "Books",
  "date": "Date"
}
```

### Focus Session

```json
{
  "duration": 45,
  "date": "Date"
}
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/StudyPulse.git
cd StudyPulse
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Start Backend Server

```bash
npm start
```

### 4️⃣ Run Frontend

* Open `dashboard.html` in browser
  OR
* Use Live Server (VS Code recommended)

---

## ⚠️ Important Notes

* Backend should run on:

```
http://localhost:5000
```

* Ensure CORS is enabled if frontend is separate

---

## 🧪 Debugging Guide

* Check **Console** → JS errors
* Check **Network Tab** → API responses
* If charts not loading → ensure Chart.js is included
* If no data → verify database + API

---

## 🔐 Security Considerations

* Validate all inputs (backend)
* Avoid direct DOM injection (XSS)
* Use proper authentication (future improvement)
* Add rate limiting for APIs

---

## 📈 Future Improvements

* 🔍 Global search (Ctrl + K modal)
* 📱 Mobile-first responsive UI
* 🎨 Dark mode / themes
* 🔔 Notifications & reminders
* 🤖 AI-based productivity suggestions
* 📊 Advanced analytics (weekly/monthly reports)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork repo
2. Create branch
3. Commit changes
4. Open PR

---

## 📄 License

MIT License

---

## 💡 Author

**Gill (StudyPulse Creator)**
Building AI-powered productivity systems 🚀

---

## ⭐ If you like this project

Give it a ⭐ on GitHub — it helps a lot!
