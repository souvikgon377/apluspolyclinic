# Quick Fix: Firebase Credentials Setup

## The Issue
Your application is trying to connect to Firestore but doesn't have credentials configured.

## Quick Solution (Choose One)

### Option 1: Local Development with Google Cloud CLI (Recommended for Testing)

1. **Install Google Cloud SDK** (if not installed):
   - Windows: Download from https://cloud.google.com/sdk/docs/install-sdk
   - Run the installer and follow the prompts

2. **Authenticate**:
   ```bash
   gcloud auth application-default login
   ```
   This will open a browser window for you to sign in with your Google account.

3. **Set the project**:
   ```bash
   gcloud config set project a-plus-polyclinic-asansol
   ```

4. **Restart your server**:
   ```bash
   npm start
   ```

### Option 2: Use Service Account Key (Production Ready)

1. **Get Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `a-plus-polyclinic-asansol`
   - Go to: Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Create `.env` file** in the `backend` folder:
   ```env
   PORT=4000
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=your-password
   JWT_SECRET=your-secret-key
   
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_SECRET_KEY=your-secret-key
   
   STRIPE_SECRET_KEY=your-stripe-key
   RAZORPAY_KEY_ID=your-razorpay-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   
   # Firebase Credentials (from the JSON file you downloaded)
   FIREBASE_PROJECT_ID=a-plus-polyclinic-asansol
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@a-plus-polyclinic-asansol.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
   ```

3. **Restart your server**:
   ```bash
   npm start
   ```

## What Was Fixed

1. ✅ **Model Methods**: Fixed `.select()` method to work with Firestore
2. ✅ **Mongoose Compatibility**: Removed `.toObject()` calls (Mongoose-specific)
3. ✅ **Better Error Messages**: Added helpful Firebase credential setup messages
4. ✅ **Method Chaining**: Fixed `find().select()` and `findById().select()` patterns

## Testing Without Credentials

If you just want to test that the code changes work, the server will now start even without credentials (but database operations will fail). This lets you verify the code structure is correct.

## Need Help?

- Full migration guide: `FIRESTORE_MIGRATION.md`
- Firebase documentation: https://firebase.google.com/docs/admin/setup
- Google Cloud authentication: https://cloud.google.com/docs/authentication/getting-started
