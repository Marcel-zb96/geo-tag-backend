import { PrismaClient } from "../../generated/prisma";
import * as userService from "../../src/service/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../generated/prisma", () => {
    const mPrisma = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockPrisma = new (PrismaClient as any)();

describe("user.service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getUser", () => {
        it("should return user dto when user exists", async () => {
            const user = { id: "1", name: "John", email: "john@mail.com", password: "hashed", role: "USER" };
            mockPrisma.user.findUnique.mockResolvedValue(user);

            const result = await userService.getUser("1");
            expect(result).toEqual({ id: "1", userName: "John", email: "john@mail.com" });
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
        });

        it("should throw 404 if user not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(userService.getUser("2")).rejects.toMatchObject({ status: 404, message: "User not found" });
        });

        it("should throw 500 on db error", async () => {
            mockPrisma.user.findUnique.mockRejectedValue(new Error("DB error"));

            await expect(userService.getUser("3")).rejects.toMatchObject({ status: 500, message: "Database error" });
        });
    });

    describe("createUser", () => {
        it("should create and return user dto", async () => {
            const newUser = { email: "jane@mail.com", userName: "Jane", password: "pass" };
            const savedUser = { id: "2", name: "Jane", email: "jane@mail.com", password: "hashed", role: "USER" };
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
            mockPrisma.user.create.mockResolvedValue(savedUser);

            const result = await userService.createUser(newUser);
            expect(result).toEqual({ id: "2", userName: "Jane", email: "jane@mail.com" });
            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: { email: "jane@mail.com", name: "Jane", password: "hashed" },
            });
        });

        it("should throw 500 on db error", async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
            mockPrisma.user.create.mockRejectedValue(new Error("DB error"));

            await expect(
                userService.createUser({ email: "fail@mail.com", userName: "Fail", password: "fail" })
            ).rejects.toMatchObject({ status: 500, message: "Database error" });
        });
    });

    describe("validateUser", () => {
        const OLD_ENV = process.env;

        beforeEach(() => {
            jest.resetModules();
            process.env = { ...OLD_ENV, JWT_SECRET: "secret" };
        });

        afterAll(() => {
            process.env = OLD_ENV;
        });

        it("should return token and userName on valid credentials", async () => {
            const user = { id: "3", name: "Bob", email: "bob@mail.com", password: "hashed", role: "USER" };
            mockPrisma.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

            const result = await userService.validateUser({email: "bob@mail.com", password: "password"});
            expect(result).toEqual({ token: "jwt-token", userName: "Bob" });
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "bob@mail.com" } });
            expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashed");
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: "3", role: "USER" },
                "secret",
                { expiresIn: "1h" }
            );
        });

        it("should throw 401 if user not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(userService.validateUser({email: "nouser@mail.com", password: "pass"})).rejects.toMatchObject({
                status: 401,
                message: "Invalid credentials",
            });
        });

        it("should throw 401 if password does not match", async () => {
            const user = { id: "4", name: "Eve", email: "eve@mail.com", password: "hashed", role: "USER" };
            mockPrisma.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(userService.validateUser({email: "eve@mail.com", password: "wrong"})).rejects.toMatchObject({
                status: 401,
                message: "Invalid credentials",
            });
        });
    });
});