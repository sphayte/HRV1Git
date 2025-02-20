import { ref, set, remove, update, get } from "firebase/database";
import { db } from "../config/firebase";

// Generic update function for any data path
export const updateUserData = async (userId, path, data) => {
  if (!userId) throw new Error('User must be logged in');
  const dataRef = ref(db, `users/${userId}/data/${path}`);
  await set(dataRef, data);
  return data;
};

// Add a single item to an array in Firebase
export const addItem = async (userId, path, item) => {
  if (!userId) throw new Error('User must be logged in');
  const dataRef = ref(db, `users/${userId}/data/${path}`);
  const snapshot = await get(dataRef);
  const currentData = snapshot.val() || [];
  const newData = [...currentData, { ...item, id: Date.now() }];
  await set(dataRef, newData);
  return newData;
};

// Remove an item from an array in Firebase
export const removeItem = async (userId, path, itemId) => {
  if (!userId) throw new Error('User must be logged in');
  const dataRef = ref(db, `users/${userId}/data/${path}`);
  const snapshot = await get(dataRef);
  const currentData = snapshot.val() || [];
  const newData = currentData.filter(item => item.id !== itemId);
  await set(dataRef, newData);
  return newData;
};

// Update a single item in an array
export const updateItem = async (userId, path, itemId, updates) => {
  if (!userId) throw new Error('User must be logged in');
  const dataRef = ref(db, `users/${userId}/data/${path}`);
  const snapshot = await get(dataRef);
  const currentData = snapshot.val() || [];
  const newData = currentData.map(item => 
    item.id === itemId ? { ...item, ...updates } : item
  );
  await set(dataRef, newData);
  return newData;
};

// Get data for a specific path
export const getUserData = async (userId, path) => {
  if (!userId) throw new Error('User must be logged in');
  const dataRef = ref(db, `users/${userId}/data/${path}`);
  const snapshot = await get(dataRef);
  return snapshot.val() || null;
}; 