/// <reference path="../types/express.d.ts" />

import express, { NextFunction, Request, Response } from "express";

import { authenticate, authorize } from "../middleware/auth";
import { createUser, getUser, validateUser } from "../service/user.service";
import { CreateUserDTO, UserDTO } from "../types/user";
import { Role } from "../../generated/prisma";

const router: express.Router = express.Router();

router.get('/', authenticate, authorize([Role.USER]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user: UserDTO = await getUser(req.user!.id);
    res.status(200).send({success: true, user});
  } catch (error) {
    next(error)
  }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser: CreateUserDTO = req.body;
    if (!newUser.email || !newUser.userName || !newUser.password) {
      res.status(400).send({ success: false, message: "Invalid input" });
      return;
    }
    const savedUser: UserDTO = await createUser(newUser);
    res.status(201).send({ success: true, user: savedUser });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ success: false, message: "Email and password are required" });
    }

    const {token, userName} = await validateUser(email, password);
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      userName
    });
  } catch (error) {
    next(error);
  }
})

export default router;


