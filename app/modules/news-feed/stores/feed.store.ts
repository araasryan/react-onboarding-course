import { injectable, inject } from '@servicetitan/react-ioc';
import { observable, action, IObservableArray, runInAction } from 'mobx';
import { FeedItem } from '../../common/models/feed';
import { FeedApi } from '../api/feed.api';
import { AppStore } from '../../common/stores/app.store';
import { FormState, FieldState } from 'formstate';
import { FormValidators } from '../../common/utils/form-validators';
import {
    formStateToJS,
    InputFieldState,
    TextAreaFieldState
} from '../../common/utils/form-helpers';

export type CreateFormType = FormState<{
    title: InputFieldState<string>;
    description: TextAreaFieldState<string>;
}>;

export type EditFormType = FormState<{
    id: FieldState<number | undefined>;
    title: InputFieldState<string>;
    description: TextAreaFieldState<string>;
}>;

@injectable()
export class FeedStore {
    @observable
    feed: IObservableArray<FeedItem> = observable([]);

    @observable
    isCreateModalOpen: boolean = false;

    @observable
    isEditModalOpen: boolean = false;

    private titleField = new InputFieldState('').validators(FormValidators.required);

    private descriptionField = new TextAreaFieldState('').validators(FormValidators.required);

    private idField = new FieldState(undefined) as FieldState<number | undefined>;

    createItemForm: CreateFormType = new FormState({
        title: this.titleField,
        description: this.descriptionField
    });

    editItemForm: EditFormType = new FormState({
        id: this.idField.validators(FormValidators.required),
        title: this.titleField,
        description: this.descriptionField
    });

    constructor(
        @inject(FeedApi) private feedApi: FeedApi,
        @inject(AppStore) private appStore: AppStore
    ) {}

    @action
    setEditItemData = (item: FeedItem) => {
        this.titleField.reset(item.title);
        this.descriptionField.reset(item.description);
        this.idField.reset(item.id);
    };

    @action
    resetFields = () => {
        this.titleField.reset('');
        this.descriptionField.reset('');
        this.idField.reset(undefined);
    };

    @action
    loadFeed = async () => {
        const { data: feed } = await this.feedApi.getAll();

        runInAction(() => {
            this.feed.replace(feed!);
        });
    };

    @action
    createFeedItem = async () => {
        const validationResult = await this.createItemForm.validate();
        if (validationResult.hasError) {
            return;
        }

        const item: Partial<FeedItem> = formStateToJS(this.createItemForm);

        await this.feedApi.create(item, this.appStore.user!.id!);
        await this.loadFeed();
        this.toggleCreateModal();
    };

    @action
    updateFeedItem = async () => {
        const validationResult = await this.editItemForm.validate();
        if (validationResult.hasError) {
            return;
        }

        const item: Partial<FeedItem> = formStateToJS(this.editItemForm);

        await this.feedApi.update(item.id!, item);
        await this.loadFeed();

        runInAction(() => {
            this.toggleEditModal();
        });
    };

    @action
    removeFeedItem = async (id: number) => {
        await this.feedApi.delete(id);
        await this.loadFeed();
    };

    @action
    toggleCreateModal = () => {
        this.isCreateModalOpen = !this.isCreateModalOpen;
        if (!this.isCreateModalOpen) {
            this.resetFields();
        }
    };

    @action
    toggleEditModal = () => {
        this.isEditModalOpen = !this.isEditModalOpen;
        if (!this.isEditModalOpen) {
            this.resetFields();
        }
    };
}
