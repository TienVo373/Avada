import * as settingsRepository from '../repositories/settingsRepository.js';
import * as notificationsRepository from '../repositories/notificationsRepository.js';
import moment from 'moment';
export async function getClientData(ctx) {
    try {
        const shopDomain = ctx.query.shopifyDomain;
        if (!shopDomain) ctx.throw(400, 'Missing shopifyDomain query parameter');
        const [setting, notifications] = await Promise.all([
            settingsRepository.getByShopDomain(shopDomain),
            notificationsRepository.getByShopDomain(shopDomain),
        ]);

        const clientNotifications = notifications.map(notification => {
            const createdAtDate = notification.createdAt && notification.createdAt._seconds
                ? new Date(notification.createdAt._seconds * 1000)
                : new Date(notification.createdAt);

            return {
                ...notification,
                createdAt: createdAtDate,
                timestamp: createdAtDate,
                timeago: moment(createdAtDate).fromNow()

            };
        });
        const data = {
            settings: setting,
            notifications: clientNotifications,
        };
        return ctx.body = { ...data, success: true };
    } catch (err) {
        console.error('Error fetching client data:', err);
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch client data' };
    }
}