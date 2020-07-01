import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';
import FileController from './app/controllers/fileController';
import ProviderController from './app/controllers/providerController';
import AppointmentController from './app/controllers/appointmentController';
import ScheduleController from './app/controllers/scheduleController';
import NotificationController from './app/controllers/notificationController';
import AvailableController from './app/controllers/availableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:id/available', AvailableController.index);
routes.get('/appointments', AppointmentController.index);
routes.get('/schedules', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
