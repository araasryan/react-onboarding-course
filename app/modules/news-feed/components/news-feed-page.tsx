import * as React from 'react';
import { injectDependency, provide } from '@servicetitan/react-ioc';
import { FeedStore, EditFormType, CreateFormType } from '../stores/feed.store';
import { MainLayout } from '../../common/components/main-layout';
import { Button, Modal, Form, ButtonGroup } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { FeedApi } from '../api/feed.api';
import { FeedContext } from '../../common/mocks/feed.db';
import { FeedList } from './feed-list';
import { CreateFeedItemForm } from './create-feed-item-form';
import { FeedItem } from '../../common/models/feed';

@provide({
    singletons: [FeedStore, FeedApi, FeedContext]
})
@observer
export class NewsFeedPage extends React.Component<{}> {
    @injectDependency(FeedStore)
    private feedStore!: FeedStore;

    componentDidMount() {
        this.feedStore.loadFeed();
    }

    deleteItem = (item: FeedItem) => {
        this.feedStore.removeFeedItem(item.id);
    };

    editItem = (item: FeedItem) => {
        this.feedStore.setEditItemData(item);
        this.feedStore.toggleEditModal();
    };

    renderModal(
        title: string,
        formState: EditFormType | CreateFormType,
        isOpen: boolean,
        toggleOpen: () => void,
        save: () => void
    ) {
        const { title: titleField, description } = formState.$;
        return (
            <Modal open={isOpen}>
                <Modal.Header title={title} />
                <Form onSubmit={save}>
                    <Modal.Content>
                        <CreateFeedItemForm title={titleField} description={description} />
                    </Modal.Content>
                    <Modal.Footer>
                        <ButtonGroup className="justify-content-between">
                            <Form.Button onClick={toggleOpen} type="button">
                                Cancel
                            </Form.Button>
                            <Form.Button disabled={formState.hasError} type="submit" primary>
                                Save
                            </Form.Button>
                        </ButtonGroup>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }

    render() {
        const {
            feed,
            isCreateModalOpen,
            toggleCreateModal,
            createItemForm,
            createFeedItem,
            editItemForm,
            isEditModalOpen,
            toggleEditModal,
            updateFeedItem
        } = this.feedStore;
        return (
            <MainLayout>
                <div className="m-b-2 d-f justify-content-center">
                    <Button primary onClick={toggleCreateModal} className="align-self-center">
                        Create New
                    </Button>
                </div>
                <FeedList data={feed} onDelete={this.deleteItem} onEdit={this.editItem} />
                {this.renderModal(
                    'Create Post',
                    createItemForm,
                    isCreateModalOpen,
                    toggleCreateModal,
                    createFeedItem
                )}
                {this.renderModal(
                    'Edit Post',
                    editItemForm,
                    isEditModalOpen,
                    toggleEditModal,
                    updateFeedItem
                )}
            </MainLayout>
        );
    }
}
