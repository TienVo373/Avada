// import {getShopify} from '@shopify/app-bridge-utils';
// import {AppBridgeContext} from '@shopify/app-bridge-react';

// /**
//  * Request optional scopes dynamically
//  * @param {object} app - App Bridge instance
//  * @param {string[]} scopes - list of optional scopes
//  */
// export async function requestOptionalScopes(app, scopes = []) {
//   if (!app || scopes.length === 0) return;

//   try {
//     const granted = await app.dispatch(getShopify().scopes.request(scopes));
//     console.info('[OptionalScopes] Granted:', granted);
//   } catch (e) {
//     console.error('[OptionalScopes] Request failed', e);
//   }
// }
