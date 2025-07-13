
export interface CreateUserDTO {
    email: string;
    userName: string;
    password: string;
}

export interface UserDTO {
    id: string,
    email: string,
    userName: string,
}

export interface LoginDTO {
    email: string;
    password: string;
}