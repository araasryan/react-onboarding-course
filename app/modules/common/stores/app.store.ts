import { injectable } from '@servicetitan/react-ioc';
import { action, observable, computed } from 'mobx';
import { UserDTO } from '../models/user';

@injectable()
export class AppStore {
    @observable
    private authUser?: UserDTO;

    @action
    setAuthUser(user: UserDTO) {
        this.authUser = user;
    }

    @action
    removeAuthUser() {
        this.authUser = undefined;
    }

    @computed
    get isAuthenticated() {
        return !!this.authUser;
    }
}
