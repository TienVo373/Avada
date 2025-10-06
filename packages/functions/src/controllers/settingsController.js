
import { getCurrentShop } from'../helpers/auth'; 
import * as settingsRepository from '../repositories/settingsRepository'
import defaultSetting from '../const/defaultSetting';

export async function getSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized: shopId not found' };
      return;
    }

    let settings = await settingsRepository.create(shopId,defaultSetting);
    ctx.body = { data: settings };
    
  } catch (err) {
    console.error('getSettings error', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
}
export async function saveSettings(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized: shopId not found' };
      return;
    }

    const payload = ctx.request.body || {};
    await settingsRepository.save(shopId, payload);

    const latest = await settingsRepository.get(shopId);
    ctx.body = { data: latest };
  } catch (err) {
    console.error('saveSettings error', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
}
export async function updateOne(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    if (!shopId) {
      ctx.status = 403;
      ctx.body = { error: 'Unauthorized: shop not found' };
      return;
    }

    const data = ctx.req.body;
    console.log(data);
    await settingsRepository.save(shopId, data);

    ctx.body = { success: true, message: 'Settings updated' };
  } catch (err) {
    console.error('updateOne error', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error' };
  }
}
