import * as React from 'react';
import { observer } from 'mobx-react';
import { injectDependency, provide } from '@servicetitan/react-ioc';
import { Form, ButtonGroup, Link } from '@servicetitan/design-system';
import { RegisterStore } from '../stores/register.store';
import { AuthLayout } from './auth-layout';
import { Label } from '../../common/components/label';
import { enumToOptions } from '../../common/utils/form-helpers';
import { UserRole } from '../../common/enums/user-role';
import { ActionStatus } from '../../common/enums/action-status';

const userRoleOptions = enumToOptions(UserRole);

@provide({
    singletons: [RegisterStore]
})
@observer
export class RegisterPage extends React.Component {
    @injectDependency(RegisterStore)
    private registerStore!: RegisterStore;

    render() {
        const { errorMessage, formState, register: handleRegister, state } = this.registerStore;
        const { login, userRole, password, confirmPassword } = formState.$;
        return (
            <AuthLayout title="Register" error={errorMessage}>
                <Form onSubmit={handleRegister}>
                    <Form.Input
                        type="text"
                        error={login.hasError}
                        value={login.value}
                        onChange={login.onChangeHandler}
                        label={
                            <Label label="Login" hasError={login.hasError} error={login.error} />
                        }
                    />
                    <Form.Input
                        type="password"
                        error={password.hasError}
                        value={password.value}
                        onChange={password.onChangeHandler}
                        label={
                            <Label
                                label="Password"
                                hasError={password.hasError}
                                error={password.error}
                            />
                        }
                    />
                    <Form.Input
                        type="password"
                        error={confirmPassword.hasError}
                        value={confirmPassword.value}
                        onChange={confirmPassword.onChangeHandler}
                        label={
                            <Label
                                label="Password Confirmation"
                                hasError={confirmPassword.hasError}
                                error={confirmPassword.error}
                            />
                        }
                    />
                    <Form.Select
                        error={userRole.hasError}
                        value={userRole.value}
                        onChange={userRole.onChangeHandler}
                        options={userRoleOptions}
                        label={
                            <Label
                                label="Role"
                                hasError={userRole.hasError}
                                error={userRole.error}
                            />
                        }
                    />
                    <ButtonGroup fullWidth>
                        <Link href="#/login" primary>
                            Login
                        </Link>
                        <Form.Button
                            disabled={state === ActionStatus.Pending}
                            type="submit"
                            primary
                        >
                            Register
                        </Form.Button>
                    </ButtonGroup>
                </Form>
            </AuthLayout>
        );
    }
}
