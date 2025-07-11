import { Note, PrismaClient } from "../../generated/prisma";
import { NoteDTO, SaveNoteDTO, UpdateNoteDTO } from "../types/note";

const prisma = new PrismaClient()

export const getUserNotes = async (userId: string): Promise<NoteDTO[]> => {
    try {
        const userNotes: Note[] | null = await prisma.note.findMany({ where: { authorId: userId } })
        return userNotes.map((note) => parseNote(note));
    } catch (error) {
        throw { status: 500, message: "Database error", details: error };
    }
}

export const getAllNotes = async (): Promise<NoteDTO[]> => {
    try {
        const allNotes: Note[] = await prisma.note.findMany();
        return allNotes.map((note) => parseNote(note));
    } catch (error) {
        throw { status: 500, message: "Database error", details: error }; 
    }
}

export const updateNote = async (id: string, updates: UpdateNoteDTO): Promise<NoteDTO> => {
    try {
        const updatedNote: Note = await prisma.note.update({
            where: { id: id },
            data: updates,
        });
        return parseNote(updatedNote);
    } catch (error: any) {
        if (error.code == "P2025") {
            throw { status: 404, message: "Note not found", details: error.message }
        }
        throw { status: 500, message: "Database error", details: error }
    }
}

export const saveNote = async (userId: string, newNote: SaveNoteDTO): Promise<NoteDTO> => {
    try {
        const savedNote: Note = await prisma.note.create({
            data: {
                title: newNote.title,
                content: newNote.content,
                latitude: newNote.latitude,
                longitude: newNote.longitude,
                authorId: userId,
            },
        });

        return parseNote(savedNote);
    } catch (error) {
        throw { status: 500, message: "Failed to save the note", details: error };
    }
}

export const deleteNote = async (noteId: string): Promise<NoteDTO> => {
    try {
        const deletedNote: Note = await prisma.note.delete({ where: { id: noteId } });
        return parseNote(deletedNote);
    } catch (error) {
        throw { status: 500, message: "Failed to delete note.", details: error }
    }
}


const parseNote = (note: Note): NoteDTO => {
    const parsedNote: NoteDTO = {
        id: note.id,
        title: note.title ? note.title : "",
        content: note.content ? note.content : "",
        latitude: note.latitude,
        longitude: note.longitude,
        createdAt: note.createdAt,
    }
    return parsedNote;
}