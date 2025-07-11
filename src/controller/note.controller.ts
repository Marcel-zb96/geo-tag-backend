import express, { NextFunction, Request, Response } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { Role } from "../../generated/prisma";
import { NoteDTO, SaveNoteDTO, UpdateNoteDTO } from "../types/note";
import { deleteNote, getAllNotes, getUserNotes, saveNote, updateNote } from "../service/note.service";

const router: express.Router = express.Router();

router.get('/', authenticate, authorize([Role.USER, Role.ADMIN]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notes: NoteDTO[] = await getUserNotes(req.user!.id);
        res.status(200).send({ success: true, notes });
    } catch (error) {
        next(error);
    }
});

router.get('/all', authenticate, authorize([Role.ADMIN]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allNotes: NoteDTO[] = await getAllNotes();
        res.status(200).send({success: true, notes: allNotes})
    } catch (error) {
        next(error);
    }
});

router.post('/', authenticate, authorize([Role.USER, Role.ADMIN]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const noteData: SaveNoteDTO = req.body;
        const savedNote = await saveNote(req.user!.id, noteData);
        res.status(201).send({ success: true, note: savedNote });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', authenticate, authorize([Role.USER, Role.ADMIN]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const noteId = req.params.id;
        const updates: UpdateNoteDTO = req.body;
        const updatedNote = await updateNote( noteId, updates );
        res.status(200).send({ success: true, note: updatedNote });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, authorize([Role.USER, Role.ADMIN]), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const noteId = req.params.id;
        const deletedNote = await deleteNote(noteId);
        res.status(200).send({ success: true, note: deletedNote });
    } catch (error) {
        next(error);
    }
});

export default router;
