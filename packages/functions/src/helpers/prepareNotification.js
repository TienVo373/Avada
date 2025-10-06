import admin from 'firebase-admin';
/**
 * Convert Shopify order into Notification object
 * @param {Object} shop - shop data from Firestore
 * @param {Object} order - Shopify order (GraphQL node)
 * @returns {Object} notification data
 */
export default function prepareNotification(shop, order) {
  const customer = order?.customer || {};
  const lineItem = order?.lineItems?.edges?.[0]?.node || {};
  const product = lineItem?.product || {};
const productImage = product.images?.nodes?.[0]?.url || '';
  return {
    shopId: shop.id,
    shopDomain: shop.shopifyDomain || '',
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    city: customer.defaultAddress?.city || '',
    country: customer.defaultAddress?.country || '',
    productName: product.title || '',
    productId: product.id || '',
    productImage: productImage,
    createdAt: order?.createdAt || 'unknown'
  };
}