import * as React from 'react';
import { EditActionProps, getActionCell } from '../../common/components/kendo-grid/editable-cell';
import { IGridUser } from '../stores/users-grid.store';
import { Stack, Button } from '@servicetitan/design-system';
import { KendoGridCellProps } from '../../common/components/kendo-grid/kendo-grid';
import { Confirm } from '../../common/components/confirm';

const ViewAction: React.FC<KendoGridCellProps<IGridUser>> = ({ gridState, dataItem }) => {
    if (!gridState) {
        return <td />;
    }

    const edit = () => gridState.edit(dataItem);
    const remove = () => gridState.removeFromDataSource(dataItem.id);

    return (
        <td>
            <Stack justifyContent="space-between">
                <Button text primary onClick={edit}>
                    Edit
                </Button>
                <Confirm
                    title="Delete User"
                    message="Are you sure you want to delete this user?"
                    onConfirm={remove}
                >
                    {handleConfirm => (
                        <Button text negative onClick={handleConfirm}>
                            Delete
                        </Button>
                    )}
                </Confirm>
            </Stack>
        </td>
    );
};

const EditAction: React.FC<EditActionProps<IGridUser>> = ({ gridState, formState, dataItem }) => {
    if (!gridState) {
        return <td />;
    }

    const save = async () => {
        const { hasError } = await formState.validate();
        if (hasError) {
            return;
        }

        gridState.saveEdit(dataItem);
    };

    const cancel = () => gridState.cancelEdit(dataItem);

    return (
        <td>
            <Stack justifyContent="space-between">
                <Button text onClick={cancel}>
                    Cancel
                </Button>

                <Button text primary onClick={save}>
                    Save
                </Button>
            </Stack>
        </td>
    );
};

export const ActionsCell = getActionCell({
    edit: EditAction,
    view: ViewAction
});
