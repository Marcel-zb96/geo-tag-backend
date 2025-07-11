import { PrismaClient, User } from "../../generated/prisma"
import { CreateUserDTO, UserDTO } from "../types/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

export const getUser = async (id: string): Promise<UserDTO> => {
    try {
        const user: User | null = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw { status: 404, message: "User not found" };
        }
        return parseUser(user);
    } catch (error: any) {
        if (error.status === 404) {
            throw error;
        }
        throw { status: 500, message: "Database error", details: error };
    }
}

export const createUser = async (newUser: CreateUserDTO): Promise<UserDTO> => {
    try {
        const savedUser: User = await prisma.user.create({
            data: {
                email: newUser.email,
                name: newUser.userName,
                password: await hashPassword(newUser.password),
            },
        });

        return parseUser(savedUser);
    } catch (error) {
        throw { status: 500, message: "Database error", details: error };
    }
}


export const validateUser = async (email: any, password: any): Promise<{token: string, userName: string}> => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw { status: 401, message: "Invalid credentials" };
    }

    const passwordMatch: boolean = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw { status: 401, message: "Invalid credentials" };
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
        { id: user.id, role: user.role },
        secret,
        { expiresIn: '1h' }
    );

    return { token, userName: user.name! };
}

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const parseUser = (user: User): UserDTO => {
    const parsedUser: UserDTO = {
        userName: user.name!,
        email: user.email,
        id: user.id
    }

    return parsedUser;
}
