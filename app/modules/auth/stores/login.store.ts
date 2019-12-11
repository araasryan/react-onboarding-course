import { action, observable } from 'mobx';
import { injectable, inject } from '@servicetitan/react-ioc';
import { FormState } from 'formstate';
import { ActionStatus } from '../../common/enums/action-status';
import { AuthApi } from '../api/auth.api';
import { InputFieldState, formStateToJS } from '../../common/utils/form-helpers';
import { FormValidators } from '../../common/utils/form-validators';
import { UserCredentials } from '../../common/models/user';
import { AppStore } from '../../common/stores/app.store';

@injectable()
export class LoginStore {
    @observable state: ActionStatus;
    @observable errorMessage?: string;

    @inject(AppStore)
    private appStore!: AppStore;

    private loginField = new InputFieldState('test')
        .validators(FormValidators.required)
        .disableAutoValidation();

    private passwordField = new InputFieldState('test')
        .validators(FormValidators.required)
        .disableAutoValidation();

    formState = new FormState({
        login: this.loginField,
        password: this.passwordField
    });

    constructor(@inject(AuthApi) private api: AuthApi) {
        this.state = ActionStatus.Undefined;
    }

    @action
    setActionStatus = (status: ActionStatus) => {
        this.state = status;
    };

    @action
    setErrorMessage = (message?: string) => {
        this.errorMessage = message;
    };

    @action
    login = async (): Promise<void> => {
        const validationResult = await this.formState.validate();
        if (validationResult.hasError) {
            return;
        }

        const user: UserCredentials = formStateToJS(this.formState);

        this.setActionStatus(ActionStatus.Pending);

        const result = await this.api.login(user);

        if (result.status !== 200) {
            this.setErrorMessage(result.statusText);
            this.setActionStatus(ActionStatus.Failed);
        } else {
            this.appStore.setAuthUser(result.data!);
            this.setActionStatus(ActionStatus.Succeed);
        }
    };
}
