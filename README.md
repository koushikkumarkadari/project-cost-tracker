# Project Cost Tracker

A mini web application to help users manage project expenses efficiently. Users can add, edit, and delete items and other costs related to a project, view the total cost dynamically, and secure their data with Firebase Authentication and Firestore.

## Features

- **User Authentication**: Secure login and signup using Google Authentication via Firebase.
- **Add, Edit, Delete Items**: Manage project items (e.g., hardware, software) with name and cost.
- **Add, Edit, Delete Other Costs**: Manage miscellaneous costs (e.g., shipping, taxes) with description and amount.
- **Display Total Cost**: Dynamically calculate and display the total project cost (sum of items and other costs).
- **Data Persistence**: Store and retrieve user-specific data in Firebase Firestore.
- **Responsive UI**: Built with Chakra UI for a clean, mobile-friendly interface.
- **State Management**: Use Redux Toolkit to manage application state globally.
- **Error Handling**: Graceful handling of network and Firestore errors with user feedback via toasts and alerts.

## Technologies Used

- **Frontend Framework**: React.js (with Vite for fast development)
- **State Management**: Redux Toolkit
- **UI Components**: Chakra UI
- **Backend Database**: Firebase Firestore (NoSQL cloud database)
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Routing**: React Router DOM
- **Deployment**: Vercel (optional: Netlify)

## Prerequisites

- Node.js (v16 or higher) and npm installed on your machine.
- A Firebase project set up with Firestore and Authentication enabled.
- A Google account for testing authentication.
- Git installed for version control.

## Setup Instructions

### Clone the Repository

```bash
git clone <your-repo-url>
cd project-cost-tracker
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

1. Create a `.env` file in the root directory.
2. Add your Firebase configuration details (obtained from Firebase Console > Project Settings):

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Ensure `.env` is added to `.gitignore` to avoid exposing sensitive information.

## Firebase Configuration

### Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click "Add project" and name it (e.g., `project-cost-tracker`).
3. Disable Google Analytics for simplicity.

### Enable Firestore

1. Navigate to Firestore Database > Create Database.
2. Start in production mode and choose a location (e.g., `us-central`).

### Enable Authentication

1. Go to Authentication > Sign-in method.
2. Enable the Google provider.

### Add Web App

1. In Project Settings, add a web app and copy the Firebase config object.
2. Use these values in your `.env` file (see above).

### Set Firestore Security Rules

In Firestore > Rules, add the following to restrict access to authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Running the Application

### Start the Development Server

```bash
npm run dev
```

The app will run at `http://localhost:5173` (or another port if 5173 is in use).

### Test the Application

1. Visit `http://localhost:5173` in your browser.
2. Sign in or sign up with Google.
3. Add, edit, or delete items and other costs, and verify the total cost updates dynamically.
4. Check Firestore (`/users/{userId}/items` and `/users/{userId}/otherCosts`) for persisted data.

## Deployment

### Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Deploy to Vercel

1. Sign up at [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. Add the environment variables from your `.env` file in Vercel’s dashboard.
4. Deploy the app and access the live URL (e.g., `https://your-app.vercel.app`).

### Verify Deployment

1. Test authentication, data persistence, and CRUD operations on the live URL.
2. Add the deployed domain to Firebase Authentication > Sign-in method > Authorized domains.

## Project Structure

```
project-cost-tracker/
├── public/
├── src/
│   ├── components/
|   |   ├── Analytics.jsx    # Show charts summarizing costs.
│   │   ├── Form.jsx         # Form for adding items and other costs
│   │   ├── Dashboard.jsx    # Dashboard for viewing, editing, deleting data
│   │   ├── Login.jsx        # Login page with Google Sign-In
│   │   └── Signup.jsx       # Signup page with Google Sign-In
│   ├── authSlice.js         # Redux slice for authentication state
│   ├── itemsSlice.js        # Redux slice for managing items
│   ├── otherCostsSlice.js   # Redux slice for managing other costs
│   ├── store.js             # Redux store configuration
│   ├── firebase.js          # Firebase initialization and config
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Entry point
├── .env                     # Environment variables (not tracked by Git)
├── .gitignore
├── package.json
└── README.md
```

## Security

- **Firestore Security Rules**: Restrict read/write access to authenticated users only for their own data.
- **Environment Variables**: Firebase config secrets are stored in `.env` and not committed to Git.
- **Error Handling**: Network, authentication, and database errors are handled gracefully with user feedback via Chakra UI toasts and alerts.

## Future Enhancements

- **Real-Time Updates**: Use Firestore’s `onSnapshot` for live data syncing.
- **Sorting and Filtering**: Add options to sort items/costs by cost/amount or filter by thresholds.
- **Cost Visualization**: Integrate Chart.js to display a pie chart of items vs. other costs.
- **Offline Support**: Enhance Firestore offline persistence with Redux Persist for better offline UX.
- **Improved UI**: Add custom themes and animations with Chakra UI.

## Submission Details

- **GitHub Repository**: [\[GitHub repo URL here\]](https://github.com/koushikkumarkadari/project-cost-tracker)
- **Deployed URL**: [\[Vercel URL here\]](https://project-cost-tracker-blue.vercel.app/)