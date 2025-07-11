
export interface NoteDTO {
    id: string;
    title: string;
    content: string;
    latitude: string;
    longitude: string;
    createdAt: Date;
}

export interface UpdateNoteDTO {
    id?: string;
    title?: string;
    content?: string;
    createdAt?: Date;
    latitude?: string;
    longitude?: string;
}

export interface SaveNoteDTO {
    title: string;
    content: string;
    latitude: string;
    longitude: string;
}