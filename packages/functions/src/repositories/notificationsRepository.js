import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
export const collection = db.collection('notifications');

/**
 * @param {Object} data - Notification data
 * @returns {Promise<string>} The ID of the created notification document
 */
export async function createOne(data) {
  const notification = await collection.add({
    ...data,
    timestamp: new Date(data.timestamp),
  });
  return notification.id;
}

/**
 * @param {Object} params
 * @param {string} params.shopId
 * @param {number} [params.limit=10]
 * @param {string} [params.after]
 * @returns {Promise<Array<Object>>}
 */
export async function get({ shopId, limit = 10, after }) {
  let queryRef = collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', 'desc')
    .limit(limit);

  if (after) {
    const doc = await collection.doc(after).get();
    if (doc.exists) {
      queryRef = queryRef.startAfter(doc);
    }
  }
  const snapshot = await queryRef.get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * @param {string} shopId
 * @returns {Promise<Array<Object>>}
 */
export async function getByShopId(shopId) {
  const snapshot = await collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
