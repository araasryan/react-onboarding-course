import { AxiosPromise, AxiosResponse } from 'axios';
import { injectable, inject } from '@servicetitan/react-ioc';
import { UserContext } from '../../common/mocks/users.db';
import { mockResponse } from '../../common/mocks/utils';
import { User, UserCredentials, UserRegisterModel, UserDTO } from '../../common/models/user';

export interface IAuthAPI {
    register(user: UserRegisterModel): AxiosPromise<UserDTO | undefined>;

    login(creds: UserCredentials): AxiosPromise<UserDTO | undefined>;
}

@injectable()
export class AuthApi implements IAuthAPI {
    constructor(@inject(UserContext) private userContext: UserContext) {}

    async login(creds: UserCredentials): Promise<AxiosResponse<UserDTO | undefined>> {
        const user = this.userContext.findByLogin(creds.login);

        if (!user || user.password !== creds.password) {
            return mockResponse(undefined, 401, 'wrong username or password');
        }

        const userDto: UserDTO = {
            id: user.id,
            login: user.login,
            userRole: user.userRole
        };

        return mockResponse(userDto, 200);
    }

    async register(
        userRegisterModel: UserRegisterModel
    ): Promise<AxiosResponse<UserDTO | undefined>> {
        const userToSave: User = {
            login: userRegisterModel.login,
            password: userRegisterModel.password,
            userRole: userRegisterModel.userRole
        };

        const user = this.userContext.create(userToSave);
        if (user) {
            const userDto: UserDTO = {
                id: user.id,
                login: user.login,
                userRole: user.userRole
            };
            return mockResponse(userDto, 201);
        }
        return mockResponse(undefined, 400, 'login already exists');
    }
}
