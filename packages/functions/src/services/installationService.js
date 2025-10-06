import { initShopify, syncOrders, createWebhooks } from './shopifyService'
import { getShopByShopifyDomain } from '@avada/core';
import * as settingsRepository from '../repositories/settingsRepository';
import defaultSettings from '../const/defaultSetting';

export async function installApp(ctx) {
    console.log("Running installApp...");
    try {
        
        const shopifyDomain = ctx.state.shopify.shop
        const shop = await getShopByShopifyDomain(shopifyDomain);
        const shopify = initShopify(shop);
        const shopId = shop.id;
        await Promise.all([
            settingsRepository.create(shopId, defaultSettings),
            syncOrders(shopify, shop),
            createWebhooks(shopify)
        ])

        console.info(`[afterInstall] Default settings ensured for shop=${shopifyDomain} (id=${shopId})`);

    }
    catch (e) {
        console.error(e.message);
    }
    console.log("ShopifyDomain from ctx:", ctx.state.shopify.shop);
};
