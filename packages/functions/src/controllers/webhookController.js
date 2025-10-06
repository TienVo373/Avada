import * as notificationRepository from '@functions/repositories/notificationsRepository';
import prepareNotification from '@functions/helpers/prepareNotification';
import { initShopify } from '@functions/services/shopifyService';
import { loadGraphQL } from '@functions/helpers/graphql/graphqlHelpers';
import { getShopByShopifyDomain } from '@avada/core';

export async function listenNewOrder(ctx) {
  try {
    const order = ctx.req.body;
    const shopDomain = ctx.request.header['x-shopify-shop-domain'];
    console.log(shopDomain, 'shopdomain')
    const shop = await getShopByShopifyDomain(shopDomain);
    const shopify = initShopify(shop);

    const query = loadGraphQL('/notification.graphql');
    const { order: orderData } = await shopify.graphql(query, {
      orderId: order.admin_graphql_api_id
    });
    console.log(order.admin_graphql_api_id);

    const notification = prepareNotification(shop, orderData);
    const returnNoti = await notificationRepository.createOne(notification);
    console.log('New order processed and notification created:', returnNoti);
    ctx.status = 200;
    ctx.body = { data: notification, success: true };
  } catch (e) {
    console.error('[listenNewOrder] error', e);
    ctx.body = { data: [], success: false };
  }
}

