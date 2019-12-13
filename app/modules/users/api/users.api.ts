import { AxiosResponse } from 'axios';
import { UserDTO, User } from '../../common/models/user';
import { injectable, inject } from '@servicetitan/react-ioc';
import { UserContext } from '../../common/mocks/users.db';
import { mockResponse } from '../../common/mocks/utils';

export interface IUsersApi {
    getAll(): Promise<AxiosResponse<UserDTO[] | undefined>>;
    updateUser(id: number, user: User): Promise<AxiosResponse<User | undefined>>;
    deleteUser(id: number): Promise<AxiosResponse<UserDTO | undefined>>;
}

@injectable()
export class UsersApi implements IUsersApi {
    constructor(@inject(UserContext) private userContext: UserContext) {}

    async getAll(): Promise<AxiosResponse<UserDTO[] | undefined>> {
        const result = this.userContext.findAll();
        const users: UserDTO[] = result.map(user => {
            const { password, ...userDto } = user;
            return userDto;
        });
        return mockResponse(users, 200);
    }

    async updateUser(id: number, user: Partial<User>): Promise<AxiosResponse<User | undefined>> {
        const updatedUser = this.userContext.update(id, user);
        if (!updatedUser) {
            return mockResponse(undefined, 400);
        }
        return mockResponse(updatedUser, 200);
    }

    async deleteUser(id: number): Promise<AxiosResponse<UserDTO | undefined>> {
        const toDeleteUser = this.userContext.findById(id);
        const deleted = this.userContext.delete(id);
        if (deleted) {
            const { password, ...userDto } = toDeleteUser!;
            return mockResponse(userDto, 200);
        }
        return mockResponse(undefined, 400);
    }
}
