import 'dotenv/config';
import express from "express";

import userController from "./controller/user.controller";

const app = express();

app.use(express.json());

app.use('/api/user', userController);
  
export default app;
