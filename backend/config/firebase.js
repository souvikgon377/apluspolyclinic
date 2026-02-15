// Firebase Admin SDK for backend services
import admin from 'firebase-admin';

// Initialize Firebase Admin
let firebaseConfig;

if (process.env.FIREBASE_PRIVATE_KEY) {
  // Use service account from environment variables (production)
  firebaseConfig = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "a-plus-polyclinic-asansol",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  };
} else {
  // For development - try to use Application Default Credentials
  console.log('\n⚠️  No Firebase credentials found in environment variables');
  console.log('Attempting to use Application Default Credentials...\n');
  
  firebaseConfig = {
    projectId: "a-plus-polyclinic-asansol",
  };
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp(firebaseConfig);
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('\n❌ Firebase initialization error:', error.message);
    console.log('\n📝 Setup Instructions:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nOption 1 (Quick - Local Development):');
    console.log('  1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install');
    console.log('  2. Run: gcloud auth application-default login');
    console.log('  3. Run: gcloud config set project a-plus-polyclinic-asansol');
    console.log('\nOption 2 (Production):');
    console.log('  1. Get service account key from Firebase Console');
    console.log('  2. Add to .env file (see .env.example)');
    console.log('  3. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    console.log('\nFor detailed instructions, see: FIRESTORE_MIGRATION.md');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Don't throw - let the app start but operations will fail gracefully
    // throw error;
  }
}

// Export Firestore database instance
export const db = admin.firestore();

// Export auth for verification if needed
export const auth = admin.auth();