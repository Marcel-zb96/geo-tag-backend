import 'dotenv/config';
import express from "express";

import userController from "./controller/user.controller";
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/user', userController);

app.use(errorHandler);

export default app;
