import * as notificationsRepository from '../repositories/notificationsRepository.js';
import { getCurrentShop, getCurrentShopData } from '../helpers/auth.js';

/**
 * 
 * @param {*} ctx 
 * @returns 
 */
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

    const data = await notificationsRepository.createOne({
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
    ctx.body = { data };
  } catch (error) {
    console.error('Error creating notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to create notification' };
  }
}
/** 
 * 
 * @param {*} ctx 
 * @returns 
 */
export async function getNotifications(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const { limit, after, sortOrder } = ctx.query;
    const notifications = await notificationsRepository.get({
      shopId: shopData.id,
      limit: parseInt(limit, 10),
      after: after || undefined,
      sortOrder: sortOrder
    })

    console.log('notifications: ', notifications);
    ctx.status = 200;
    ctx.body = {
      data: notifications,
      pageInfo: {
        hasNext: notifications.length === parseInt(limit, 10),
        hasPre: !!after
      }
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch notifications' };
  }
}
