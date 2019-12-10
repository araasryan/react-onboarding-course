import { UserRole } from '../enums/user-role';

export interface UserCredentials {
    login: string;
    password: string;
}

export interface User extends Partial<UserCredentials> {
    id?: number;
    confirmPassword?: string;
    userRole?: UserRole;
}
