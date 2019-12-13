import { injectable, inject } from '@servicetitan/react-ioc';
import { KendoGridState } from '../../common/components/kendo-grid/kendo-grid-state';
import { AsyncDataSource, ProcessedData } from '../../common/components/kendo-grid/data-sources';
import { UsersApi } from '../api/users.api';
import { setFormStateValues } from '../../common/utils/form-helpers';
import { FormState, FieldState } from 'formstate';
import { UserRole } from '../../common/enums/user-role';

export interface IGridUser {
    id: number;
    login: string;
    password?: string;
    userRole: UserRole;
}

@injectable()
export class UserGridStore {
    constructor(@inject(UsersApi) private usersApi: UsersApi) {}

    get inEdit() {
        return this.gridState.inEdit.size > 0;
    }

    private get dataSource() {
        return new AsyncDataSource(
            {
                get: this.loadUsers,
                update: this.updateUser,
                remove: this.removeUser
            },
            this.idSelector
        );
    }

    private idSelector(row: IGridUser) {
        return row.id;
    }

    getFormState = (user: IGridUser) => {
        return setFormStateValues(
            new FormState({
                id: new FieldState(user.id),
                login: new FieldState(user.login),
                password: new FieldState(user.password),
                userRole: new FieldState<UserRole>(user.userRole)
            }),
            user
        );
    };

    get gridState() {
        return new KendoGridState({
            dataSource: this.dataSource,
            selectionLimit: 3,
            getFormState: this.getFormState,
            pageSize: 10
        });
    }

    loadUsers = async (): Promise<ProcessedData<IGridUser>> => {
        const { data: users } = await this.usersApi.getAll();

        const data = users!.map(u => ({
            id: u.id!,
            userRole: u.userRole,
            login: u.login,
            password: ''
        }));
        return {
            data,
            filteredCount: data.length
        };
    };

    updateUser = async (id: number, user: IGridUser): Promise<void> => {
        await this.usersApi.updateUser(id, user);
    };

    removeUser = async (id: number): Promise<IGridUser | undefined> => {
        const { data: deletedUser } = await this.usersApi.deleteUser(id);
        if (!deletedUser) {
            return undefined;
        }
        const gridUser: IGridUser = {
            id: deletedUser.id!,
            login: deletedUser.login,
            userRole: deletedUser.userRole
        };
        return gridUser;
    };
}
