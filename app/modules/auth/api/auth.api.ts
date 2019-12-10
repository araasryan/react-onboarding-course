import { AxiosPromise, AxiosResponse } from 'axios';
import { injectable, inject } from '@servicetitan/react-ioc';
import { UserContext } from '../../common/mocks/users.db';
import { mockResponse } from '../../common/mocks/utils';
import { User, UserCredentials } from '../../common/models/user';

export interface IAuthAPI {
    register(user: User): AxiosPromise<User | undefined>;

    login(creds: UserCredentials): AxiosPromise<User | undefined>;
}

@injectable()
export class AuthApi implements IAuthAPI {
    constructor(@inject(UserContext) private userContext: UserContext) {}

    async login(creds: UserCredentials): Promise<AxiosResponse<User | undefined>> {
        const user = this.userContext.findByLogin(creds.login);

        if (!user || user.password !== creds.password) {
            return mockResponse(undefined, 401, 'wrong username or password');
        }

        return mockResponse(user, 200);
    }

    async register(user: User): Promise<AxiosResponse<User | undefined>> {
        const newUser = this.userContext.create(user);
        if (newUser) {
            return mockResponse(newUser, 201);
        }
        return mockResponse(undefined, 400, 'login already exists');
    }
}
