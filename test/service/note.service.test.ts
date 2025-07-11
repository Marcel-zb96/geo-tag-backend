import { Note } from "../../generated/prisma";
import { getUserNotes, getAllNotes, updateNote, saveNote } from "../../src/service/note.service";

// Mock the PrismaClient and its methods
jest.mock("../../generated/prisma", () => {
    return {
        PrismaClient: jest.fn(() => ({
            note: {
                findMany: jest.fn(),
                update: jest.fn(),
                create: jest.fn(),
                delete: jest.fn(),
            },
        })),
    };
});

// Retrieve the mocked PrismaClient
const { PrismaClient } = jest.requireMock("../../generated/prisma");
const mockFindMany = (PrismaClient as jest.Mock).mock.results[0].value.note.findMany;
const mockUpdate = (PrismaClient as jest.Mock).mock.results[0].value.note.update;
const mockCreate = (PrismaClient as jest.Mock).mock.results[0].value.note.create;
const mockDelete = (PrismaClient as jest.Mock).mock.results[0].value.note.delete;

describe("note.service - getUserNotes", () => {
    
    const fakeDate = new Date("2023-01-01T00:00:00.000Z");
    const fakeNote: Note = {
        id: "note1",
        title: "Test title",
        content: "Test content",
        latitude: "10",
        longitude: "20",
        createdAt: fakeDate,
        authorId: "user1",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return mapped notes when notes are found", async () => {
        // Simulate findMany returning an array with one note
        mockFindMany.mockResolvedValueOnce([fakeNote]);

        const result = await getUserNotes("user1");

        expect(result).toEqual([
            {
                id: fakeNote.id,
                title: fakeNote.title,
                content: fakeNote.content,
                latitude: fakeNote.latitude,
                longitude: fakeNote.longitude,
                createdAt: fakeNote.createdAt,
            },
        ]);
    });

    it("should return empty array if no notes found (findMany returns empty)", async () => {
        // Simulate findMany returning an empty array
        mockFindMany.mockResolvedValueOnce([]);

        const result = await getUserNotes("user1");

        expect(result).toEqual([]);
    });

    it("should throw 500 error when database error occurs", async () => {
        // Simulate findMany throwing an error
        const error = new Error("Test DB failure");
        mockFindMany.mockRejectedValueOnce(error);

        await expect(getUserNotes("user1")).rejects.toEqual({
            status: 500,
            message: "Database error",
            details: error,
        });
    });
});


describe("note.service - getAllNotes", () => {
    
    const fakeDate = new Date("2023-01-01T00:00:00.000Z");
    const fakeNote: Note = {
        id: "note1",
        title: "Test title",
        content: "Test content",
        latitude: "10",
        longitude: "20",
        createdAt: fakeDate,
        authorId: "user1",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return mapped notes when notes are found", async () => {
        // Simulate findMany returning an array with one note
        mockFindMany.mockResolvedValueOnce([fakeNote]);

        const result = await getAllNotes();

        expect(result).toEqual([
            {
                id: fakeNote.id,
                title: fakeNote.title,
                content: fakeNote.content,
                latitude: fakeNote.latitude,
                longitude: fakeNote.longitude,
                createdAt: fakeNote.createdAt,
            },
        ]);
    });

    it("should return empty array if no notes found", async () => {
        // Simulate findMany returning an empty array
        mockFindMany.mockResolvedValueOnce([]);

        const result = await getAllNotes();

        expect(result).toEqual([]);
    });

    it("should throw 500 error when database error occurs", async () => {
        // Simulate findMany throwing an error
        const error = new Error("Test DB failure");
        mockFindMany.mockRejectedValueOnce(error);

        await expect(getAllNotes()).rejects.toEqual({
            status: 500,
            message: "Database error",
            details: error,
        });
    });
});

describe("note.service - updateNote", () => {
    const fakeDate = new Date("2023-01-01T00:00:00.000Z");
    const existingNote: Note = {
        id: "note1",
        title: "Old title",
        content: "Old content",
        latitude: "10",
        longitude: "20",
        createdAt: fakeDate,
        authorId: "user1",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the updated note when update is successful", async () => {
        const updates = { title: "New title", content: "New content" };
        // Simulated updated note from prisma
        const updatedNote: Note = {
            ...existingNote,
            title: updates.title,
            content: updates.content,
        };

        mockUpdate.mockResolvedValueOnce(updatedNote);

        const result = await updateNote("note1", updates);

        expect(result).toEqual({
            id: updatedNote.id,
            title: updatedNote.title,
            content: updatedNote.content,
            latitude: updatedNote.latitude,
            longitude: updatedNote.longitude,
            createdAt: updatedNote.createdAt,
        });
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "note1" },
            data: updates,
        });
    });

    it("should throw a 404 error when note not found (P2025 error)", async () => {
        const updates = { title: "New title", content: "New content" };
        const prismaError = { code: "P2025", message: "Record to update not found." };

        mockUpdate.mockRejectedValueOnce(prismaError);

        await expect(updateNote("nonexistent", updates)).rejects.toEqual({
            status: 404,
            message: "Note not found",
            details: prismaError.message,
        });
    });

    it("should throw a 500 error when a database error occurs", async () => {
        const updates = { title: "New title", content: "New content" };
        const prismaError = new Error("Test DB failure");

        // Make sure the error does not match error.code === "P2025"
        (prismaError as any).code = "SOME_OTHER_CODE";

        mockUpdate.mockRejectedValueOnce(prismaError);

        await expect(updateNote("note1", updates)).rejects.toEqual({
            status: 500,
            message: "Database error",
            details: prismaError,
        });
    });
});

describe("note.service - saveNote", () => {
    const fakeDate = new Date("2023-01-01T00:00:00.000Z");
    const userId = "user1";
    const newNote = {
        title: "New Note",
        content: "Some content",
        latitude: "10",
        longitude: "20",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the saved note when creation is successful", async () => {
        const savedNote: Note = {
            id: "note2",
            title: newNote.title,
            content: newNote.content,
            latitude: newNote.latitude,
            longitude: newNote.longitude,
            createdAt: fakeDate,
            authorId: userId,
        };

        mockCreate.mockResolvedValueOnce(savedNote);

        const result = await saveNote(userId, newNote);

        expect(result).toEqual({
            id: savedNote.id,
            title: savedNote.title,
            content: savedNote.content,
            latitude: savedNote.latitude,
            longitude: savedNote.longitude,
            createdAt: savedNote.createdAt,
        });
        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                title: newNote.title,
                content: newNote.content,
                latitude: newNote.latitude,
                longitude: newNote.longitude,
                authorId: userId,
            },
        });
    });

    it("should throw a 500 error when creation fails", async () => {
        const error = new Error("Create failed");
        mockCreate.mockRejectedValueOnce(error);

        await expect(saveNote(userId, newNote)).rejects.toEqual({
            status: 500,
            message: "Failed to save the note",
            details: error,
        });
    });
});

describe("note.service - deleteNote", () => {
    const fakeDate = new Date("2023-01-01T00:00:00.000Z");
    const noteId = "note1";
    const deletedNote: Note = {
        id: noteId,
        title: "To delete",
        content: "Delete this note",
        latitude: "10",
        longitude: "20",
        createdAt: fakeDate,
        authorId: "user1",
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the deleted note when deletion is successful", async () => {
        mockDelete.mockResolvedValueOnce(deletedNote);

        const result = await (await import("../../src/service/note.service")).deleteNote(noteId);

        expect(result).toEqual({
            id: deletedNote.id,
            title: deletedNote.title,
            content: deletedNote.content,
            latitude: deletedNote.latitude,
            longitude: deletedNote.longitude,
            createdAt: deletedNote.createdAt,
        });
        expect(mockDelete).toHaveBeenCalledWith({ where: { id: noteId } });
    });

    it("should throw a 500 error when deletion fails", async () => {
        const error = new Error("Delete failed");
        mockDelete.mockRejectedValueOnce(error);

        await expect(
            (await import("../../src/service/note.service")).deleteNote(noteId)
        ).rejects.toEqual({
            status: 500,
            message: "Failed to delete note.",
            details: error,
        });
    });
});