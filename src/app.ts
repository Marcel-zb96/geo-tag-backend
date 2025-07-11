import 'dotenv/config';
import express from "express";

import userController from "./controller/user.controller";
import noteController from "./controller/note.controller";
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/user', userController);

app.use('/api/notes', noteController);

app.use(errorHandler);

export default app;
