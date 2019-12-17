import * as React from 'react';
import { injectDependency, provide } from '@servicetitan/react-ioc';
import { MainLayout } from '../../common/components/main-layout';
import { UserGridStore } from '../stores/users-grid.store';
import { KendoGrid } from '../../common/components/kendo-grid/kendo-grid';
import { observer } from 'mobx-react';
import { UsersApi } from '../api/users.api';
import { GridColumn } from '@progress/kendo-react-grid';
import { StandardColumnMenuFilter } from '../../common/components/kendo-grid/filters/column-menu-filters';
import { singleItemMultiSelectColumnMenuFilter } from '../../common/components/kendo-grid/filters/multiselect-filter/multiselect-filter';
import { getEnumValues, enumToOptions } from '../../common/utils/form-helpers';
import { UserRole } from '../../common/enums/user-role';
import { ActionsCell } from './actions-cell';
import { ConfirmNavigation } from '../../common/components/confirm-navigation';
import {
    getSelectEditableCell,
    TextEditableCell
} from '../../common/components/kendo-grid/editable-cell';
import { PasswordEditableCell } from './password-editable-cell';

const UserRoleCell = getSelectEditableCell({
    options: enumToOptions(UserRole)
});

@provide({
    singletons: [UserGridStore, UsersApi]
})
@observer
export class UsersGridPage extends React.Component {
    @injectDependency(UserGridStore)
    private userGridStore!: UserGridStore;

    render() {
        const { inEdit, gridState } = this.userGridStore;
        return (
            <MainLayout>
                <KendoGrid gridState={gridState} groupable>
                    <GridColumn field="id" title="id" editable={false} />
                    <GridColumn
                        filterable
                        filter="text"
                        field="login"
                        title="login"
                        cell={TextEditableCell}
                        columnMenu={StandardColumnMenuFilter}
                    />
                    <GridColumn
                        field="password"
                        title="password"
                        editable={true}
                        cell={PasswordEditableCell}
                    />
                    <GridColumn
                        filterable
                        field="userRole"
                        title="role"
                        editable={true}
                        cell={UserRoleCell}
                        columnMenu={singleItemMultiSelectColumnMenuFilter(getEnumValues(UserRole))}
                    />
                    <GridColumn cell={ActionsCell} sortable={false} />
                </KendoGrid>
                <ConfirmNavigation when={inEdit} />
            </MainLayout>
        );
    }
}
