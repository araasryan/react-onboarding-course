import { injectable } from '@servicetitan/react-ioc';
import { UserRole } from '../enums/user-role';
import { cloneDeep } from '../utils/clone-deep';
import { User } from '../models/user';

export const users: User[] = [
    {
        id: 1,
        login: 'titan',
        password: '*titan*',
        userRole: UserRole.Admin
    },
    {
        id: 2,
        login: 'technician',
        password: 'technic123',
        userRole: UserRole.Operator
    },
    {
        id: 3,
        login: 'magician',
        password: 'YouShallNotPass',
        userRole: UserRole.Operator
    },
    {
        id: 4,
        login: 'guest',
        password: 'welcome',
        userRole: UserRole.Public
    },
    {
        id: 5,
        login: 'test',
        password: 'test',
        userRole: UserRole.Admin
    }
];

@injectable()
export class UserContext {
    private get nextId() {
        const maxId = Math.max(...users.map(u => u.id as number), 0);
        return maxId + 1;
    }

    findAll(): User[] {
        return cloneDeep(users);
    }

    findByLogin(login: string): User | undefined {
        const user = users.find(u => u.login === login);
        if (user) {
            return cloneDeep(user);
        }
        return;
    }

    findById(id: number): User | undefined {
        const user = users.find(u => u.id === id);
        if (user) {
            return cloneDeep(user);
        }
        return undefined;
    }

    findIndexById(id: number): number {
        return users.findIndex(u => u.id === id);
    }

    create(user: User): User | undefined {
        const existing = this.findByLogin(user.login!);
        if (existing) {
            return undefined;
        }
        const dbUser = cloneDeep(user);
        dbUser.id = this.nextId;
        users.push(dbUser);

        return dbUser;
    }

    update(id: number, user: Partial<User>): User | undefined {
        const userDb = this.findById(id);
        if (!userDb) {
            return undefined;
        }
        const updated = { ...userDb, ...user };
        const index = this.findIndexById(user.id!);
        users.splice(index, 1, updated);

        return updated;
    }

    delete(id: number): boolean {
        const index = this.findIndexById(id);
        if (index === -1) {
            return false;
        }

        users.splice(index, 1);

        return true;
    }
}
