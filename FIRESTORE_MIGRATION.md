# MongoDB to Firestore Migration Guide

## Overview
Your application has been successfully migrated from MongoDB to Google Cloud Firestore.

## What Was Changed

### 1. Firebase Configuration (`backend/config/firebase.js`)
- Updated from Firebase client SDK to Firebase Admin SDK
- Now exports Firestore database instance (`db`) and Admin Auth
- Configured for project: `a-plus-polyclinic-asansol`

### 2. Models
All three models have been converted from Mongoose schemas to Firestore helpers:

- **userModel.js** - Users collection
- **doctorModel.js** - Doctors collection  
- **appointmentModel.js** - Appointments collection

The new models provide methods compatible with the old Mongoose API:
- `create(data)` - Create new document
- `findById(id)` - Find by document ID
- `findOne(query)` - Find single document by field
- `find(query)` - Find all matching documents
- `findByIdAndUpdate(id, data)` - Update document
- `findByIdAndDelete(id)` - Delete document
- `deleteMany(query)` - Delete multiple documents
- `select(fields)` - Select/exclude fields

### 3. Controllers
Updated all controllers to use Firestore:
- Replaced `new Model()` + `.save()` with `.create()`
- All other queries work with the new model helpers

### 4. Server Configuration (`server.js`)
- Removed MongoDB connection (`connectDB`)
- Added Firestore initialization
- Removed `mongodb.js` import

### 5. Dependencies (`package.json`)
- Removed: `mongoose`, `firebase` (client SDK)
- Kept: `firebase-admin` (already installed)

## Setup Instructions

### For Local Development

The current setup uses Application Default Credentials. To run locally:

1. **Install Google Cloud SDK** (if not already installed):
   - Download from: https://cloud.google.com/sdk/docs/install
   
2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth application-default login
   ```

3. **Set your project**:
   ```bash
   gcloud config set project a-plus-polyclinic-asansol
   ```

### For Production/Deployment

For production, use a Service Account key:

1. **Generate Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `a-plus-polyclinic-asansol`
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

2. **Update `backend/config/firebase.js`**:
   
   Uncomment and configure the credential section:
   ```javascript
   const firebaseConfig = {
     projectId: "a-plus-polyclinic-asansol",
     credential: admin.credential.cert({
       projectId: process.env.FIREBASE_PROJECT_ID,
       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
     })
   };
   ```

3. **Add to `.env` file**:
   ```env
   FIREBASE_PROJECT_ID=a-plus-polyclinic-asansol
   FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

   **Note**: Copy the entire private key from the JSON file, including the BEGIN/END markers.

### Alternative: Using Service Account JSON File

You can also use the JSON file directly:

```javascript
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount)
};
```

**Important**: Add `serviceAccountKey.json` to `.gitignore`!

## Database Structure

Firestore uses collections instead of MongoDB collections:

- **Collections**: `users`, `doctors`, `appointments`
- **Documents**: Each document has an auto-generated ID (accessible as `_id` in the code)
- **Schema-less**: No enforced schema (validation happens in application code)

## Key Differences from MongoDB

1. **No Transactions (yet)**: Basic CRUD operations work, but complex transactions may need updates
2. **Query Limitations**: Firestore has different query capabilities than MongoDB
3. **Indexing**: Composite indexes need to be created in Firebase Console for complex queries
4. **Cost Model**: Firestore charges per read/write/delete operation

## Verification

Test your endpoints to ensure everything works:

```bash
# Start the backend server
cd backend
npm start
```

Test key endpoints:
- User registration/login
- Doctor CRUD operations
- Appointment booking
- Admin operations

## Rollback Instructions

If you need to rollback to MongoDB:

1. Restore backup files:
   ```bash
   cd backend/models
   mv userModel.mongoose.backup userModel.js
   mv doctorModel.mongoose.backup doctorModel.js
   mv appointmentModel.mongoose.backup appointmentModel.js
   ```

2. Install MongoDB dependencies:
   ```bash
   npm install mongoose
   ```

3. Restore `server.js` and `firebase.js` from git history

## Firestore Console

Access your Firestore database:
https://console.firebase.google.com/project/a-plus-polyclinic-asansol/firestore

## Support

For issues, refer to:
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)

---

**Migration completed on**: February 15, 2026
