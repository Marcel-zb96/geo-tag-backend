import { PrismaClient, User } from "../../generated/prisma"

const prisma = new PrismaClient()

export const getUser = async (id: string): Promise<User> => {
    try {
        const user: User | null = await prisma.user.findUnique({ where: { id: id } });
        if (!user) {
            throw { status: 404, message: "User not found" };
        }
        return user;
    } catch (error) {
        throw { status: 500, message: "Database error", details: error };
    }
}