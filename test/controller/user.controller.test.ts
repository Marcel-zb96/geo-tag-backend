import request from 'supertest';
import * as userService from '../../src/service/user.service';
import { Role } from '../../generated/prisma';
import app from "../../src/app";
import { Request, Response, NextFunction } from 'express';

// Mock middleware to bypass authentication/authorization
declare global {
    namespace Express {
        interface Request {
            user?: { id: string; role: string };
        }
    }
}

jest.mock("../../src/middleware/auth", () => ({
    authenticate: (req: Request, res: Response, next: NextFunction) => {
        req.user = { id: "test-user-id", role: Role.ADMIN };
        next();
    },
    authorize: (_roles: any) => (req: Request, res: Response, next: NextFunction) => {
        next();
    },
}));

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users/', () => {
        it('should return user data for authenticated and authorized user', async () => {
            const mockUser = {
            id: 'test-user-id',
            email: 'test@example.com',
            userName: 'testuser'
            };

            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);

            const res = await request(app)
            .get('/api/user/')

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toEqual(mockUser);
            expect(userService.getUser).toHaveBeenCalledWith('test-user-id');
        });

        it('should call next(error) on service error', async () => {
    
            jest.spyOn(userService, 'getUser').mockRejectedValue(new Error('DB error'));

            const res = await request(app)
                .get('/api/user/')

            expect(res.status).toBe(500);
        });
    });

    describe('POST /users/register', () => {
        it('should create a new user with valid input', async () => {
            jest.spyOn(userService, 'createUser').mockResolvedValue({
                id: 'test-user-id',
                email: 'test@example.com',
                userName: 'testuser'
            });

            const res = await request(app)
                .post('/api/user/register')
                .send({
                    email: 'test@example.com',
                    userName: 'testuser',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toEqual({
                id: 'test-user-id',
                email: 'test@example.com',
                userName: 'testuser'
            });
            expect(userService.createUser).toHaveBeenCalled();
        });

        it('should return 400 if input is invalid', async () => {
            jest.spyOn(userService, 'createUser').mockResolvedValue({
                id: '',
                email: '',
                userName: ''
            });
            const res = await request(app)
                .post('/api/user/register')
                .send({ email: '', userName: '', password: '' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid input');
        });

        it('should call next(error) on service error', async () => {
            jest.spyOn(userService, 'createUser').mockRejectedValue(new Error('DB error'));

            const res = await request(app)
                .post('/api/user/register')
                .send({
                    email: 'test@example.com',
                    userName: 'testuser',
                    password: 'password123'
                });

            expect(res.status).toBe(500);
        });
    });

    describe('POST /users/login', () => {
        it('should login with valid credentials', async () => {
            jest.spyOn(userService, 'validateUser').mockResolvedValue({
                token: 'jwt-token',
                userName: 'testuser'
            });

            const res = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBe('jwt-token');
            expect(res.body.userName).toBe('testuser');
            expect(res.body.message).toBe('Login successful');
            expect(userService.validateUser).toHaveBeenCalledWith({email: 'test@example.com', password: 'password123'});
        });

        it('should return 400 if email or password is missing', async () => {
            jest.spyOn(userService, 'validateUser').mockResolvedValue({
                token: '',
                userName: ''
            });
            const res = await request(app)
                .post('/api/user/login')
                .send({ email: '', password: '' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email and password are required');
        });

        it('should call next(error) on service error', async () => {
            jest.spyOn(userService, 'validateUser').mockRejectedValue(new Error('Auth error'));

            const res = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(500);
        });
    });
});