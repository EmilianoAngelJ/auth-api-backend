# Express Firebase Backend API

This is a backend API built with **Express.js** and **Firebase Admin SDK** to handle user authentication, contacts management, and user data. It uses **Firebase Authentication** for security and **Firestore** as the database.



## Features

1. User signup, login, and token refresh with Firebase Authentication
2. Secure endpoints verifying Firebase ID tokens
3. CRUD operations for user contacts
4. User profile retrieval and update
5. CORS protection with whitelist
6. Logging with Morgan 

## Screenshots

<p>
  <img src="screenshots/sign_in.png" alt="Home Screen" width="200" style="display:inline-block; margin-right:10px;"/>
  <img src="screenshots/sign_up.png" alt="Home Screen" width="200" style="display:inline-block; margin-right:10px;"/>
  <img src="screenshots/profile_demo.gif" alt="Home Screen" width="200" style="display:inline-block; margin-right:10px;"/>
  <img src="screenshots/contacts_demo.gif" alt="Home Screen" width="200" style="display:inline-block; margin-right:10px;"/>
</p>

## Tech Stack

### 🛠️ Core Technologies

- **[Flutter](https://flutter.dev/)** – UI toolkit for building natively compiled applications across mobile, web, and desktop from a single codebase.
- **[Dart](https://dart.dev/)** – Programming language optimized for building fast, multi-platform apps.

### 🧩 Middleware

- **[`morgan`](https://github.com/expressjs/morgan)** – HTTP request logger middleware for Node.js, useful for debugging.
- **[`cors`](https://github.com/expressjs/cors)** – Middleware to enable Cross-Origin Resource Sharing in Express apps.

### 📦 Dependencies

- **[`axios`](https://axios-http.com/)** – Promise-based HTTP client for making requests to external APIs.
- **[`dotenv`](https://github.com/motdotla/dotenv)** – Loads environment variables from a `.env` file into `process.env`.
- **[`express`](https://expressjs.com/)** – Fast, unopinionated, minimalist web framework for Node.js.
- **[`firebase-admin`](https://firebase.google.com/docs/admin/setup)** – Firebase Admin SDK to manage Firebase services like authentication and Firestore from a trusted server.

## Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/EmilianoAngelJ/auth-api-backend.git
cd auth-api-back
```

### 2. Install dependencies

```bash
npm install
```

> ⚠️ If you already have a Firebase proyect configured with authentication and Firestore enabled skip to step number 7.

### 3. Create a Firebase Project 

- Go to [Firebase Console](https://console.firebase.google.com/).
- Click **Add project** and follow the setup wizard.

### 4. Enable Firebase Authentication

- In your Firebase project, go to **Authentication > Get Started**.
- Under **Sign-in method**, enable **Email/Password**.

### 5. Set Up Firestore Database

- Go to **Firestore Database > Create database**.
- Choose **Start in test mode** for development purposes.
- Select a Cloud Firestore location and click **Enable**.

### 7. Connect the backend to Firebase

- Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
- Select **Add an app > web**, there name and register it.
- Go to **Project settings > Service accounts > Generate new private key**.
- Rename the downloaded file to **db-credential.json** and save it inside the db folder.

### 8. Configure the frontend

Follow the getting started instructions placed on the README.md file

[Auth API App Backend](https://github.com/EmilianoAngelJ/auth-api-app.git)

### 8. Run the server

```bash
node ./src/index.js
```

## Notes

- This project is for educational and portfolio purposes.
- Connection with a Firebase project and it's configuration is needed.

## License

This project is licensed under the [MIT License](LICENSE).

---

Built using Flutter by [Emiliano Angel](https://github.com/EmilianoAngelJ)
