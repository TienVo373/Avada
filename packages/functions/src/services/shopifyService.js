import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import fs from 'fs';
import path from 'path';
import * as notificationRepository from '../repositories/notificationsRepository';
export const API_VERSION = '2024-04';
import appConfig from '@functions/config/app';
import isEmpty from 'lodash/isEmpty';
import prepareNotification from '../helpers/prepareNotification';

/**
 * Create Shopify instance with the latest API version and auto limit enabled
 *
 * @param {Shop} shopData
 * @param {string} apiVersion
 * @return {Shopify}
 */
export function initShopify(shopData, apiVersion = API_VERSION) {
  const shopParsedData = prepareShopData(shopData.id, shopData, shopifyConfig.accessTokenKey);
  const {shopifyDomain, accessToken} = shopParsedData;

  return new Shopify({
    shopName: shopifyDomain,
    accessToken,
    apiVersion,
    autoLimit: true
  });
}
/**
 * Load GraphQL query from file
 * @param {string} relativePath
 * @returns {string}
 */
function loadGraphQL(relativePath) {
  const filePath = path.resolve(__dirname, '../graphql', relativePath);
  return fs.readFileSync(filePath, 'utf8');
}
/**
 * Sync first 30 orders from Shopify to notifications
 * @param {Shopify} shopify
 * @param {Object} shop - Shop object from Avada Core
 */
export async function syncOrders(shopify, shop) {
  try {
    const query = loadGraphQL('orders.graphql');

    const result = await shopify.graphql(query, { first: 30 });
    const edges = result?.orders?.edges || [];

    if (edges.length === 0) {
      console.info(`No orders found for shop ${shopify.options.shopName}`);
      return;
    }
    const notifications = edges.map(edge => prepareNotification(shop, edge.node));

    // Save notifications in Firestore
     for (const notification of notifications) {
      await notificationRepository.createOne(notification);
    }

    console.info(
      `Successfully created ${notifications.length} notifications for shop ${shopify.options.shopName}`
    );
  } catch (err) {
    console.error(`syncOrders error for shop ${shopify.options.shopName}`, err);
    throw err;
  }
};
/**
 * Register order create webhook for the shop
 * @param {Object} shopify - initialized Shopify client
 */
export async function createWebhooks(shopify) {
  // Clean up unused webhooks
  const currentWebhooks = await shopify.webhook.list();
  const unusedWebhooks = currentWebhooks.filter(
    webhook => !webhook.address.includes(appConfig.baseUrl)
  );
  if (!isEmpty(unusedWebhooks)) {
    await Promise.all(unusedWebhooks.map(webhook => shopify.webhook.delete(webhook.id)));
  }

  // Ensure we don’t duplicate
  const existing = await shopify.webhook.list({
    address: `https://${appConfig.baseUrl}/webhook/orders/new`
  });
  console.log(existing, 'existing webhooks');
  

  if (existing.length === 0) {
    await shopify.webhook.create({
      topic: 'orders/create',
      address: `https://${appConfig.baseUrl}/webhook/orders/new`,
      format: 'json'
    });
    console.info(`[createWebhooks] Registered orders/create webhook for ${shopify.options.shopName}`);
  }
}
