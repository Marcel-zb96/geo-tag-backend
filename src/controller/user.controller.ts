/// <reference path="../types/express.d.ts" />

import express, { NextFunction, Request, Response } from "express";

import { PrismaClient, User } from "../../generated/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { getUser } from "../service/user.service";

const router: express.Router = express.Router();

router.get('/', authenticate, authorize(['USER']),async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string; role: string })?.id;
    if (!userId) {
      res.status(400).send({ success: false, message: "User ID is missing" });
    }
    const user: User = await getUser(userId!);
    res.status(200).send({success: true, user});
  } catch (error) {
    next(error)
  }
});

//router.post('/register')

export default router;