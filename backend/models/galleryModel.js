import { db } from '../config/firebase.js';

// Firestore collection reference
const galleryCollection = db.collection('gallery');

// Helper functions to mimic Mongoose API
const galleryModel = {
  // Create a new gallery item
  async create(galleryData) {
    const docRef = galleryCollection.doc();
    const galleryWithDefaults = {
      image: galleryData.image || '',
      title: galleryData.title || '',
      description: galleryData.description || '',
      date: galleryData.date || Date.now(),
    };
    
    await docRef.set(galleryWithDefaults);
    return { _id: docRef.id, ...galleryWithDefaults };
  },

  // Find all gallery items
  async find(query = {}) {
    const snapshot = await galleryCollection.get();
    const items = [];
    snapshot.forEach(doc => {
      items.push({ _id: doc.id, ...doc.data() });
    });
    
    // Sort by date descending (newest first)
    items.sort((a, b) => b.date - a.date);
    
    return items;
  },

  // Find gallery item by ID
  async findById(id) {
    const doc = await galleryCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { _id: doc.id, ...doc.data() };
  },

  // Delete gallery item by ID
  async findByIdAndDelete(id) {
    const doc = await galleryCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const data = { _id: doc.id, ...doc.data() };
    await galleryCollection.doc(id).delete();
    return data;
  },

  // Update gallery item by ID
  async findByIdAndUpdate(id, updateData, options = {}) {
    const docRef = galleryCollection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    return { _id: updatedDoc.id, ...updatedDoc.data() };
  }
};

export default galleryModel;
