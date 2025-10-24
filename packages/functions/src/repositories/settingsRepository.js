import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();
export const collection = firestore.collection('settings');

/**
 * @param {string} shopId4
 * @returns {Promise<Object|null>}
 */

export async function get(shopId) {
  const docRef = collection.doc(shopId);
  const doc = await docRef.get();
  return doc.exists ? doc.data() : null;
}
/**
 * @param {string} shopId
 * @param {object} data
 * @returns {Promise<void>}
 */
export async function create({ shopId, defaultSetting, shopDomain }) {
  const docRef = collection.doc(shopId);
  const doc = await docRef.get(); ``
  if (!doc.exists) {
    await docRef.set({
      ...defaultSetting,
      shopDomain,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...defaultSetting, shopDomain };
  }
  return doc.data();
}


export async function update(shopId, data) {
  const docRef = collection.doc(shopId);
  await docRef.set(
    {
      ...data,
      updatedAt: new Date()
    },
    { merge: true }
  );
}
// export async function getByShopId(shopId) {
//   const docRef = collection.doc(shopId);
//   const doc = await docRef.get();
//   return doc.exists ? { id: doc.id, ...doc.data() } : null;
// }
export async function getByShopDomain(shopDomain) {
  const snapshot = await collection
    .where('shopDomain', '==', shopDomain)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { ...doc.data() };
}