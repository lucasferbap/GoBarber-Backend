import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import Joi from '@hapi/joi';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsControllers = new SessionsController();

sessionsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    sessionsControllers.create,
);

export default sessionsRouter;
