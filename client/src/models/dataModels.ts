export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    created_at: string;
    Notebooks: Notebook[];
}

export interface Notebook {
    id: number;
    title: string;
    user_id: number;
    Notes: Note[];
    createdAt: Date;
}

export enum Importance_Level {
    MAIN = "Main",
    HIGHLIGHT = "Highlight",
    STICKY = "Sticky"
}

export interface Note {
    id: number;
    content: string;
    notebookId: number;
    importance: Importance_Level;
    createdAt: Date;
}

export interface ProblemResponse {
    hint_one: string;
    hint_two: string;
    solution: string;
    code_solution: string;
}