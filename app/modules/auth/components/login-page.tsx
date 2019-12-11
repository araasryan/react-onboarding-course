import * as React from 'react';
import { observer } from 'mobx-react';
import { injectDependency, provide } from '@servicetitan/react-ioc';
import { Form, ButtonGroup, Link } from '@servicetitan/design-system';
import { AuthLayout } from './auth-layout';
import { Label } from '../../common/components/label';
import { ActionStatus } from '../../common/enums/action-status';
import { LoginStore } from '../stores/login.store';

@provide({
    singletons: [LoginStore]
})
@observer
export class LoginPage extends React.Component {
    @injectDependency(LoginStore)
    private loginStore!: LoginStore;

    render() {
        const { errorMessage, formState, login: handleLogin, state } = this.loginStore;
        const { login, password } = formState.$;
        return (
            <AuthLayout title="Login" error={errorMessage}>
                <Form onSubmit={handleLogin}>
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
                    <ButtonGroup fullWidth>
                        <Link href="#/" primary>
                            Register
                        </Link>
                        <Form.Button
                            disabled={state === ActionStatus.Pending}
                            type="submit"
                            primary
                        >
                            Login
                        </Form.Button>
                    </ButtonGroup>
                </Form>
            </AuthLayout>
        );
    }
}
