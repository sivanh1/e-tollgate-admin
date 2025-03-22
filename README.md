# 🚦 E-Toll Gate Application

A simple and efficient web-based **E-Toll Gate Application** that allows users to register and request toll passes, while admins can approve or manage those requests. Built using **React.js** and **Firebase** for smooth authentication and database integration.

---

## 📦 Project Setup

Follow these steps to install and run the application:

---

### ✅ Step 1: Install Node.js

Download and install the latest LTS version of Node.js from the official website:  
🔗 [https://nodejs.org](https://nodejs.org)

---

### 📥 Step 2: Download the Project and Install Dependencies

1. Go to the GitHub repository and download the ZIP file.
2. Extract the ZIP file on your computer.
3. Open the project folder in your code editor (e.g., VS Code).
4. Open a terminal in the project directory and run:

```bash
npm install
```

---

### 🔥 Step 3: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new Firebase project.
2. Enable **Authentication** → Email/Password.
3. Enable **Firestore Database** and start in test mode.
4. In your project settings, register a new **Web App** and copy the Firebase config.
5. Open the `firebaseconfig.js` file in the project and paste your config like below:

```javascript
// firebaseconfig.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
```

---

### 🚀 Step 4: Run the Application

Start the development server with:

```bash
npm run dev
```

Now open your browser and visit:  
👉 [http://localhost:5173](http://localhost:5173)

---

## 👥 Roles

- **User**: Register and request toll passes.
- **Admin**: View, approve, and manage requests.

---

## ⚙️ Technologies Used

- React.js (Vite)
- Firebase (Authentication + Firestore)
- Tailwind CSS

---

## 🙌 Contribution

Feel free to fork this project, suggest improvements, or raise issues. Contributions are always welcome!

---

## 👨‍💻 Author

Developed by [Sivanesh]

---
