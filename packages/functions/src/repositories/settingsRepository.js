
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp();
}

const db = getFirestore();
const COLLECTION = 'settings';

/**
 * @param {string} shopId4
 * @returns {Promise<Object|null>}
 */

export async function get(shopId) {
  const docRef = db.collection(COLLECTION).doc(shopId);
  const doc = await docRef.get();
  return doc.exists ? doc.data() : null;
}
/**
 * @param {string} shopId
 * @param {object} data
 * @returns {Promise<void>}
 */
export async function create(shopId,defaultSetting) {
  const docRef = db.collection(COLLECTION).doc(shopId);
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({
      ...defaultSetting,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return defaultSetting;
  }
  return doc.data();
}


export async function save(shopId, data) {
   const docRef = db.collection(COLLECTION).doc(shopId);
  await docRef.set(
    {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}