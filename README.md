# Firebase CRUD App — Setup Guide

A React app with Firebase Auth (Email/Password) + Firestore CRUD + Hosting.

---

## Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it → continue
3. Disable Google Analytics if not needed → **Create project**

---

## Step 2 — Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Click **Email/Password** → Enable → Save
3. Click **Google** → Enable → add your support email → Save
4. Go to **Users** tab → **Add user** → enter your email & password (for email/password login)

> **Note:** Google sign-in works automatically once enabled — no extra config needed in the code.

---

## Step 3 — Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for the lab demo) → select a region → Done

---

## Step 4 — Get your Firebase Config

1. Firebase Console → ⚙️ **Project Settings** → scroll to **Your apps**
2. Click **Add app** → Web (`</>`) → register app (no hosting needed here)
3. Copy the `firebaseConfig` object shown

---

## Step 5 — Add config to the code

Open `src/firebase/config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "paste-your-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123",
};
```

Also open `.firebaserc` and replace `YOUR_PROJECT_ID` with your actual project ID.

---

## Step 6 — Install and Run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000), sign in with the user you created.

---

## Step 7 — Deploy to Firebase Hosting (optional)

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```

Your app will be live at `https://YOUR_PROJECT_ID.web.app`

---

## Firestore Security Rules (for after the demo)

In Firebase Console → Firestore → **Rules**, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This ensures only logged-in users can read/write data.
