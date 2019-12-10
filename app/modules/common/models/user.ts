import { UserRole } from '../enums/user-role';

export interface UserCredentials {
    login: string;
    password: string;
}

export interface UserRegisterModel extends UserCredentials {
    userRole: UserRole;
    confirmPassword: string;
}

export interface User {
    id?: number;
    login: string;
    userRole: UserRole;
    password: string;
}

export type UserDTO = Pick<User, 'id' | 'login' | 'userRole'>;
