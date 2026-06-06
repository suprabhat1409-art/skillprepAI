# SkillPrep AI Agent - Cloud Hosting & Android Packaging Guide

This guide details how to host your backend on MongoDB Atlas and Render/Railway, and compile your React web frontend into an Android App (APK) without affecting the original web client version.

---

## 1. MongoDB Atlas Setup (Cloud Database)

To migrate from local MongoDB to the cloud:

1. **Sign Up / Log In**: Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Cluster**:
   * Click **Create a Database** and select the **M0 Free Tier** cluster.
   * Choose your preferred cloud provider (AWS/GCP/Azure) and region.
3. **Database Security (Username & Password)**:
   * Create a database user. Note down the **Username** and **Password**.
4. **Network Access (IP Whitelist)**:
   * Navigate to **Network Access** under Security.
   * Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`). This is necessary because serverless platforms like Render/Railway rotate IP addresses.
5. **Get Connection String**:
   * Go to **Database** and click **Connect** on your cluster.
   * Choose **Drivers** and copy the connection string. It will look like this:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/skillprepai?retryWrites=true&w=majority
     ```
   * Replace `<username>` and `<password>` with the credentials you created in Step 3.

---

## 2. Backend Cloud Deployment (Render / Railway / VPS)

The Express backend already loads connection details from environment variables. Set these up in your cloud hosting provider.

### Deployment Environment Variables
Set the following keys in your hosting provider's Dashboard (e.g. Render Environment settings):

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0...` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | `your_production_secret_key` | Secure key for signing JWT login tokens |
| `PORT` | `10000` | Port handled automatically by the cloud provider |

### Option A: Hosting on Render
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Select **Root Directory** as `server` (or configure build settings from root).
3. Set the **Build Command**: `npm install`
4. Set the **Start Command**: `node server.js`
5. Click **Advanced** and add the Environment Variables listed above.
6. Render will build and deploy. Take note of the public URL (e.g., `https://skillprep-backend.onrender.com`).

### Option B: Hosting on Railway
1. Click **New Project** on Railway and link your repository.
2. Select the `server` directory as the deployment source.
3. Add the environment variables under the **Variables** tab.
4. Railway will automatically detect `npm start` and deploy the service.

---

## 3. Android APK Compilation (Capacitor)

We have configured **Capacitor** in the `client/` directory to port your React assets into a native Android workspace.

### Prerequisites
* Install [Android Studio](https://developer.android.com/studio).
* Install Android SDKs (API Level 33 or 34 recommended) inside Android Studio.

### Packaging Walkthrough

Run the following commands inside the `client` directory:

1. **Build the React Client (Pointing to Hosted API)**:
   Build the web assets using your live cloud backend URL:
   * **Windows (PowerShell)**:
     ```powershell
     $env:VITE_API_URL="https://your-backend.onrender.com/api"; npm run build
     ```
   * **Mac / Linux**:
     ```bash
     VITE_API_URL=https://your-backend.onrender.com/api npm run build
     ```
   *This compiles all React components and bundles them into `/client/dist`.*

2. **Add Android Native Platform**:
   Create the Android studio workspace:
   ```bash
   npx cap add android
   ```

3. **Sync Compiled Assets to Android Workspace**:
   Sync Vite's `/dist` files into the Android assets directory:
   ```bash
   npx cap sync
   ```

4. **Compile APK in Android Studio**:
   Open Android Studio automatically containing your project workspace:
   ```bash
   npx cap open android
   ```
   * **In Android Studio**:
     1. Wait for Gradle sync to complete.
     2. Click **Build** in the top menu -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
     3. Locate the completed `.apk` file (usually under `android/app/build/outputs/apk/debug/app-debug.apk`) and install it on your mobile device!
