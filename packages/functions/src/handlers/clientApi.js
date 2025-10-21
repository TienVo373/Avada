import App from 'koa';
import * as errorService from '@functions/services/errorService';
import clientApiRouter from '@functions/routes/clientApi';
// import cors from '@koa/cors';
// Initialize all demand configuration for an application
const api = new App();
api.proxy = true;
// api.use(cors({
//   origin: '*', // allow all domains
//   allowMethods: ['GET', 'POST', 'OPTIONS'],
//   allowHeaders: ['Content-Type', 'Authorization'],
// }));

const router = clientApiRouter();
// Register all routes for the application
api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;