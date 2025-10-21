import { initShopify, syncOrders, createWebhooks, registerScriptTag } from './shopifyService'
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
            settingsRepository.create({
                shopId: shopId,
                defaultSettings: defaultSettings,
                shopDomain: shopifyDomain
            }
            ),
            syncOrders(shopify, shop),
            createWebhooks(shopify),
            // registerScriptTag(shopifyDomain, shopify)
        ])
        console.info(`[afterInstall] Default settings ensured for shop=${shopifyDomain} (id=${shopId})`);
        return ctx.body = {
            success: true,
            massage: 'App installed successfully'
        }
    }
    catch (e) {
        console.error(e);
    }
    console.log("ShopifyDomain from ctx:", ctx.state.shopify.shop);
};
