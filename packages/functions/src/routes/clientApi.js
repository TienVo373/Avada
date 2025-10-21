import Router from 'koa-router';
import * as clientController from '../controllers/clientController.js';

export default function clientRoutes() {
  const router = new Router({ prefix: '/clientApi' });
  router.get('/notifications', clientController.getClientData);

  return router;
}