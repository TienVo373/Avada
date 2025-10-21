import { Firestore } from '@google-cloud/firestore';

/**
 * @documentation
 *
 * Only use one repository to connect to one collection
 * do not connect more than one collection from one repository
 */
const firestore = new Firestore();
export const collection = firestore.collection('notifications');

/**
 * @param {Object} data - Notification data
 * @returns {Promise<string>} The ID of the created notification document
 */
export async function createOne(data) {
  const notification = await collection.add({
    ...data,
    timestamp: data.timestamp,
    createdAt: data.createdAt
  });
  return notification.id
    ;
}

/**
 * @param {Object} params
 * @param {string} params.shopId
 * @param {string} params.sortOrder
 * @param {number} [params.limit=10]
 * @param {string} [params.after]
 * @returns {Promise<Array<Object>>}
 */
export async function get({ shopId, limit = 10, after, sortOrder = 'desc' }) {
  let queryRef = collection
    .where('shopId', '==', shopId)
    .orderBy('timestamp', sortOrder)
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
export async function getByShopDomain(shopDomain) {
  const snapshot = await collection
    .where('shopDomain', '==', shopDomain)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

