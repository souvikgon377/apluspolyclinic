import { db } from '../config/firebase.js';

// Firestore collection reference
const appointmentsCollection = db.collection('appointments');

// Helper functions to mimic Mongoose API
const appointmentModel = {
  // Create a new appointment
  async create(appointmentData) {
    const docRef = appointmentsCollection.doc();
    const appointmentWithDefaults = {
      userId: appointmentData.userId || '',
      docId: appointmentData.docId || '',
      slotDate: appointmentData.slotDate || '',
      slotTime: appointmentData.slotTime || '',
      userData: appointmentData.userData || {},
      docData: appointmentData.docData || {},
      amount: appointmentData.amount || 0,
      date: appointmentData.date || Date.now(),
      cancelled: appointmentData.cancelled || false,
      payment: appointmentData.payment || false,
      isCompleted: appointmentData.isCompleted || false,
      prescription: appointmentData.prescription || '',
      followUpDate: appointmentData.followUpDate || '',
    };
    
    await docRef.set(appointmentWithDefaults);
    return { _id: docRef.id, ...appointmentWithDefaults };
  },

  // Find appointment by ID
  async findById(id) {
    if (!id) return null;
    const doc = await appointmentsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, ...doc.data() };
  },

  // Find one appointment by query
  async findOne(query) {
    const field = Object.keys(query)[0];
    const value = query[field];
    
    const snapshot = await appointmentsCollection.where(field, '==', value).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  // Find all appointments matching query
  async find(query = {}) {
    let ref = appointmentsCollection;
    
    // Apply filters if any
    Object.keys(query).forEach(field => {
      ref = ref.where(field, '==', query[field]);
    });
    
    const snapshot = await ref.get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  // Update appointment by ID
  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!id) return null;
    await appointmentsCollection.doc(id).update(updateData);
    return await this.findById(id);
  },

  // Delete appointment by ID
  async findByIdAndDelete(id) {
    if (!id) return null;
    const appointment = await this.findById(id);
    await appointmentsCollection.doc(id).delete();
    return appointment;
  },

  // Delete many appointments
  async deleteMany(query = {}) {
    // Handle special Firestore operators
    if (query.userId && query.userId.$in) {
      const userIds = query.userId.$in;
      const batch = db.batch();
      let deletedCount = 0;
      
      // Firestore doesn't support 'in' with unlimited items, so batch them
      for (const userId of userIds) {
        const snapshot = await appointmentsCollection.where('userId', '==', userId).get();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
          deletedCount++;
        });
      }
      
      await batch.commit();
      return { deletedCount };
    }
    
    // Regular query
    const appointments = await this.find(query);
    const batch = db.batch();
    appointments.forEach(appointment => {
      batch.delete(appointmentsCollection.doc(appointment._id));
    });
    await batch.commit();
    return { deletedCount: appointments.length };
  }
};

export default appointmentModel;
