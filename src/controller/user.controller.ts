import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { PrismaClient, User } from "../../generated/prisma";

const prisma = new PrismaClient()
const router: express.Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await prisma.user.findMany();
    res.status(200).send({success: true, users});
  } catch (error) {
    console.error(error);
    res.status(404).send({success: false, error});
  }
});

export default router;