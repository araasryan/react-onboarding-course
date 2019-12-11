import { action, observable } from 'mobx';
import { injectable, inject } from '@servicetitan/react-ioc';
import { FieldState, FormState, Validator } from 'formstate';
import { UserRole } from '../../common/enums/user-role';
import { ActionStatus } from '../../common/enums/action-status';
import { AuthApi } from '../api/auth.api';
import {
    InputFieldState,
    DropdownFieldState,
    formStateToJS
} from '../../common/utils/form-helpers';
import { FormValidators } from '../../common/utils/form-validators';
import { UserRegisterModel } from '../../common/models/user';
import { AppStore } from '../../common/stores/app.store';

type SamePasswordValidator = Validator<{
    password: FieldState<string>;
    confirmPassword: FieldState<string>;
}>;

const strongPasswordValidator: Validator<string> = (value: string) => {
    if (FormValidators.passwordIsValidFormat(value)) {
        return '* password must be at least 8 characters long including a number, a lowercase letter, and an uppercase letter';
    }
    return null;
};

const samePasswordValidator: SamePasswordValidator = $ => {
    const error = 'Passwords does not match';
    if ($.password.$ !== $.confirmPassword.$) {
        $.password.setError(error);
        $.confirmPassword.setError(' ');
        return error;
    }
    return null;
};

@injectable()
export class RegisterStore {
    @observable state: ActionStatus;
    @observable errorMessage?: string;

    @inject(AppStore)
    private appStore!: AppStore;

    private loginField = new InputFieldState('test')
        .validators(FormValidators.required)
        .disableAutoValidation();

    private passwordField = new InputFieldState('test')
        .validators(FormValidators.required, strongPasswordValidator)
        .disableAutoValidation();

    private confirmPasswordField = new InputFieldState('test')
        .validators(FormValidators.required)
        .disableAutoValidation();

    private userRoleField = new DropdownFieldState<UserRole>(UserRole.Public)
        .validators(FormValidators.required)
        .disableAutoValidation();

    private passwordFormState = new FormState({
        password: this.passwordField,
        confirmPassword: this.confirmPasswordField
    })
        .compose()
        .validators(samePasswordValidator);

    formState = new FormState({
        login: this.loginField,
        userRole: this.userRoleField,
        password: this.passwordField,
        confirmPassword: this.confirmPasswordField,
        passwords: this.passwordFormState
    });

    constructor(@inject(AuthApi) private api: AuthApi) {
        this.state = ActionStatus.Undefined;
    }

    @action
    setActionStatus = async (status: ActionStatus) => {
        this.state = status;
    };

    @action
    setErrorMessage = (message?: string) => {
        this.errorMessage = message;
    };

    @action
    register = async (): Promise<void> => {
        const validationResult = await this.formState.validate();
        if (validationResult.hasError) {
            return;
        }

        const user: UserRegisterModel = formStateToJS(this.formState);

        this.setActionStatus(ActionStatus.Pending);

        const result = await this.api.register(user);

        if (result.status !== 201) {
            this.setErrorMessage(result.statusText);
            this.setActionStatus(ActionStatus.Failed);
        } else {
            this.appStore.setAuthUser(result.data!);
            this.setActionStatus(ActionStatus.Succeed);
        }
    };
}
