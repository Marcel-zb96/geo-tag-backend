
export interface NoteDTO {
    id: string;
    title: string;
    content: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
}

export interface UpdateNoteDTO {
    id?: string;
    title?: string;
    content?: string;
    createdAt?: Date;
    latitude?: number;
    longitude?: number;
}

export interface SaveNoteDTO {
    title: string;
    content: string;
    latitude: number;
    longitude: number;
}