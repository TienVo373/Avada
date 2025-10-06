import * as notificationsRepository from '../repositories/notificationsRepository.js';
import { getCurrentShop,getCurrentShopData } from '../helpers/auth.js';
import { paginateQuery } from '../repositories/helper.js';
import {collection} from '../repositories/notificationsRepository.js';

export async function createNotification(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 403;
      ctx.body = { error: 'Unauthorized: no shop in context' };
      return;
    }

    const {
      firstName,
      city,
      country,
      productName,
      productId,
      productImage,
      timestamp,
    } = ctx.request.body;

    if (!firstName || !productName) {
      ctx.status = 400;
      ctx.body = { error: 'firstName and productName are required' };
      return;
    }

    const id = await notificationsRepository.createOne({
      shopId,
      firstName,
      city,
      country,
      productName,
      productId,
      productImage,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    ctx.status = 201;
    ctx.body = { id };
  } catch (error) {
    console.error('Error creating notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create notification' };
  }
}
export async function getNotifications(ctx) {
//   try {
//     const shopData = getCurrentShopData(ctx);
//     const { limit, after, before } = ctx.query;
//     console.log('[getNotifications] shopData.id=', shopData.id);
//     const notifications = await notificationsRepository.get({
//       shopId: shopData.id,
//       shopDomain: shopData.shopifyDomain,
//       limit: limit ? parseInt(limit, 10) : 10,
//       after: after || '',
//       before: before || '',
//     });
//     ctx.status = 200;
//     ctx.body = { data: notifications,
//       pageInfo: notifications.pageInfo
//      }
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     ctx.status = 500;
//     ctx.body = { error: 'Failed to fetch notifications' };
//   }
// }
try {
    const shopData = getCurrentShopData(ctx);
    const { limit, after } = ctx.query;

    // Build Firestore query
    const notifications  =  await notificationsRepository.get ({ 
      shopId: shopData.id,
      limit: parseInt(limit, 10),
      after: after || undefined});
    console.log('notifications: ', notifications);
     ctx.status = 200;
    ctx.body = {
      data: notifications,
      pageInfo: {
        hasNext: notifications.length === parseInt(limit, 10), // simplistic next page check
        hasPre: !!after
      }
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch notifications' };
  }
}
export async function getAllByShop(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    if (!shopData?.shopId) {
      ctx.body = { error: 'Unauthorized: no shop in context' };
      return;
    }

    const notifications = await notificationsRepository.getByShopId(shopData.shopId);

    ctx.status = 200;
    ctx.body = { data: notifications }
  } catch (error) {
    console.error('Error fetching notifications by shopId:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch notifications by shopId' };
  }
}
