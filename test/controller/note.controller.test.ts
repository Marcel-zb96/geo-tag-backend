import { Request, Response, NextFunction } from "express";
import request from "supertest";
import * as noteService from "../../src/service/note.service";
import app from "../../src/app"
import { Role } from "../../generated/prisma";

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

describe("note.controller", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("GET /api/note/", () => {
        it("should return user notes", async () => {
            const mockDate = new Date();
            const mockNotes = [{
                id: "note1",
                title: "Test Note",
                content: "Content",
                latitude: 12.34,
                longitude: 56.78,
                createdAt: mockDate
            }];
            jest.spyOn(noteService, "getUserNotes").mockResolvedValue(mockNotes);
            
            const res = await request(app).get("/api/notes/");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ 
                success: true, 
                notes: [{
                    ...mockNotes[0],
                    createdAt: mockDate.toISOString()
                }]
            });
        });

        it("should return 500 if getUserNotes throws an error", async () => {
            jest.spyOn(noteService, "getUserNotes").mockRejectedValue(new Error("Test error"));
            
            const res = await request(app).get("/api/notes/");
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("Test error");
        });
    });

    describe("GET /all", () => {
        it("should return all notes for admin", async () => {
            const mockAllNotes = [{
                id: "note2",
                title: "Admin Note",
                content: "All content",
                latitude: 10.00,
                longitude: 20.00,
                createdAt: new Date()
            }];
            jest.spyOn(noteService, "getAllNotes").mockResolvedValue(mockAllNotes);
            
            const res = await request(app).get("/api/notes/all");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ 
                success: true, 
                notes: mockAllNotes.map(note => ({
                    ...note,
                    createdAt: note.createdAt.toISOString()
                }))
            });
        });

        it("should return 500 if getAllNotes throws an error", async () => {
            jest.spyOn(noteService, "getAllNotes").mockRejectedValue(new Error("Test error"));
            
            const res = await request(app).get("/api/notes/all");
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("Test error");
        });
    });

    describe("POST /", () => {
        it("should save a new note", async () => {
            const noteInput = { title: "New Note", content: "New content" };
            const savedNote = {
                id: "note3",
                ...noteInput,
                latitude: 0.00,
                longitude: 0.00,
                createdAt: new Date()
            };
            jest.spyOn(noteService, "saveNote").mockResolvedValue(savedNote);
            
            const res = await request(app).post("/api/notes/").send(noteInput);
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ 
                success: true, 
                note: { 
                    ...savedNote, 
                    createdAt: savedNote.createdAt.toISOString() 
                } 
            });
        });

        it("should return 500 if saveNote throws an error", async () => {
            jest.spyOn(noteService, "saveNote").mockRejectedValue(new Error("Test error"));
            
            const res = await request(app).post("/api/notes/").send({ title: "Test", content: "Content" });
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("Test error");
        });
    });

    describe("PATCH /:id", () => {
        it("should update an existing note", async () => {
            const noteId = "note4";
            const updates = { title: "Updated Title" };
            const updatedNote = {
                id: noteId,
                title: "Updated Title",
                content: "Existing Content",
                latitude: 0.00,
                longitude: 0.00,
                createdAt: new Date()
            };
            jest.spyOn(noteService, "updateNote").mockResolvedValue(updatedNote);
            
            const res = await request(app).patch(`/api/notes/${noteId}`).send(updates);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ 
                success: true, 
                note: { 
                    ...updatedNote, 
                    createdAt: updatedNote.createdAt.toISOString() 
                } 
            });
        });

        it("should return 500 if updateNote throws an error", async () => {
            jest.spyOn(noteService, "updateNote").mockRejectedValue(new Error("Test error"));
            
            const res = await request(app).patch("/api/notes/invalidId").send({ title: "Update" });
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("Test error");
        });
    });

    describe("DELETE /:id", () => {
        it("should delete a note", async () => {
            const noteId = "note5";
            const deletedNote = {
                id: noteId,
                title: "Deleted Note",
                content: "Deleted content",
                latitude: 0.00,
                longitude: 0.00,
                createdAt: new Date()
            };
            jest.spyOn(noteService, "deleteNote").mockResolvedValue(deletedNote);

            const res = await request(app).delete(`/api/notes/${noteId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ 
                success: true, 
                note: { 
                    ...deletedNote, 
                    createdAt: deletedNote.createdAt.toISOString() 
                }
            });
        });

        it("should return 500 if deleteNote throws an error", async () => {
            jest.spyOn(noteService, "deleteNote").mockRejectedValue(new Error("Test error"));
            
            const res = await request(app).delete("/api/notes/invalidId");
            expect(res.status).toBe(500);
            expect(res.body.error).toBe("Test error");
        });
    });
});