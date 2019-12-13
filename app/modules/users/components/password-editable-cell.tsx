import * as React from 'react';
import { getEditableCell, EditorProps } from '../../common/components/kendo-grid/editable-cell';
import { observer } from 'mobx-react';
import { Label } from '../../common/components/label';
import { Input } from '@progress/kendo-react-inputs';

const Editor = observer<React.FC<EditorProps<string>>>(
    ({ fieldState: { value, onChange, hasError, error }, className }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        };

        return (
            <td className={className}>
                <Input type="password" value={value} onChange={handleChange} valid={!hasError} />
                {hasError && <Label label="" hasError error={error} />}
            </td>
        );
    }
);

export const PasswordEditableCell = getEditableCell({
    editor: Editor,
    viewer: ({ className }) => <td className={className} />
});
