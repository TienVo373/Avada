import { Firestore } from '@google-cloud/firestore';
import { formatDateFields } from '@avada/firestore-utils';
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
 * Get notifications with pagination
 * @param {Object} params
 * @param {string} params.shopId
 * @param {number} [params.limit=10]
 * @param {string} [params.after] - cursor for forward pagination
 * @param {string} [params.before] - cursor for backward pagination
 * @param {boolean} [params.withDocs=false] - include raw Firestore docs
 * @param {boolean} [params.hasCount=false] - include total count
 * @param {string} [params.sortOrder='desc'] - 'asc' or 'desc'
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
    ...formatDateFields(doc.data()
    )
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
    ...formatDateFields(doc.data())
  }));
}
