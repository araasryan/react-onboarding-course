import * as React from 'react';
import { Form } from '@servicetitan/design-system';
import { Label } from '../../common/components/label';
import { observer } from 'mobx-react';
import { InputFieldState, TextAreaFieldState } from '../../common/utils/form-helpers';

interface Props {
    title: InputFieldState<string>;
    description: TextAreaFieldState<string>;
}

@observer
export class CreateFeedItemForm extends React.Component<Props> {
    render() {
        const { title, description } = this.props;
        return (
            <>
                <Form.Input
                    type="text"
                    error={title.hasError}
                    value={title.value}
                    onChange={title.onChangeHandler}
                    label={<Label label="Title" hasError={title.hasError} error={title.error} />}
                />
                <Form.TextArea
                    error={description.hasError}
                    value={description.value}
                    onChange={description.onChangeHandler}
                    label={
                        <Label
                            label="Description"
                            hasError={description.hasError}
                            error={description.error}
                        />
                    }
                />
            </>
        );
    }
}
