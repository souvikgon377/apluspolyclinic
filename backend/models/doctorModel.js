import { db } from '../config/firebase.js';

// Firestore collection reference
const doctorsCollection = db.collection('doctors');

// Helper functions to mimic Mongoose API
const doctorModel = {
  // Create a new doctor
  async create(doctorData) {
    const docRef = doctorsCollection.doc();
    const doctorWithDefaults = {
      name: doctorData.name || '',
      email: doctorData.email || '',
      password: doctorData.password || '',
      image: doctorData.image || '',
      speciality: doctorData.speciality || [],
      degree: doctorData.degree || '',
      experience: doctorData.experience || '',
      about: doctorData.about || '',
      available: doctorData.available !== undefined ? doctorData.available : true,
      fees: doctorData.fees || 0,
      availability: doctorData.availability || [],
      slots_booked: doctorData.slots_booked || {},
      address: doctorData.address || { line1: '', line2: '' },
      date: doctorData.date || Date.now(),
    };
    
    await docRef.set(doctorWithDefaults);
    return { _id: docRef.id, ...doctorWithDefaults };
  },

  // Find doctor by ID
  async findById(id) {
    if (!id) return null;
    const doc = await doctorsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, ...doc.data() };
  },

  // Find one doctor by query
  async findOne(query) {
    const field = Object.keys(query)[0];
    const value = query[field];
    
    const snapshot = await doctorsCollection.where(field, '==', value).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { _id: doc.id, ...doc.data() };
  },

  // Find all doctors matching query
  async find(query = {}) {
    let ref = doctorsCollection;
    
    // Apply filters if any
    Object.keys(query).forEach(field => {
      ref = ref.where(field, '==', query[field]);
    });
    
    const snapshot = await ref.get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  },

  // Update doctor by ID
  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!id) return null;
    await doctorsCollection.doc(id).update(updateData);
    return await this.findById(id);
  },

  // Delete doctor by ID
  async findByIdAndDelete(id) {
    if (!id) return null;
    const doctor = await this.findById(id);
    await doctorsCollection.doc(id).delete();
    return doctor;
  },

  // Delete many doctors
  async deleteMany(query = {}) {
    const doctors = await this.find(query);
    const batch = db.batch();
    doctors.forEach(doctor => {
      batch.delete(doctorsCollection.doc(doctor._id));
    });
    await batch.commit();
    return { deletedCount: doctors.length };
  },

  // Helper to exclude fields from result
  _excludeFields(data, excludeFields) {
    if (!data) return null;
    const fieldsArray = typeof excludeFields === 'string' ? excludeFields.split(' ') : excludeFields;
    const filtered = { ...data };
    
    if (Array.isArray(fieldsArray)) {
      fieldsArray.forEach(field => {
        const cleanField = field.replace('-', '');
        if (field.startsWith('-')) {
          delete filtered[cleanField];
        }
      });
    }
    return filtered;
  }
};

// Extend with chainable methods
doctorModel.find = function(query = {}) {
  const self = this;
  const promise = (async () => {
    let ref = doctorsCollection;
    
    // Apply filters if any
    Object.keys(query).forEach(field => {
      ref = ref.where(field, '==', query[field]);
    });
    
    const snapshot = await ref.get();
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  })();
  
  promise.select = function(excludeFields) {
    return promise.then(dataArray => {
      if (!Array.isArray(dataArray)) return dataArray;
      return dataArray.map(data => self._excludeFields(data, excludeFields));
    });
  };
  
  return promise;
};

doctorModel.findById = function(id) {
  const self = this;
  const promise = (async () => {
    if (!id) return null;
    const doc = await doctorsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { _id: doc.id, ...doc.data() };
  })();
  
  promise.select = function(excludeFields) {
    return promise.then(data => self._excludeFields(data, excludeFields));
  };
  
  return promise;
};

export default doctorModel;
