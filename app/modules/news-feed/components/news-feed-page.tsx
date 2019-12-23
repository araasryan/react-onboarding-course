import * as React from 'react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { FeedStore, EditFormType, CreateFormType } from '../stores/feed.store';
import { MainLayout } from '../../common/components/main-layout';
import { Button, Modal, Form, ButtonGroup } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { FeedApi } from '../api/feed.api';
import { FeedContext } from '../../common/mocks/feed.db';
import { FeedList } from './feed-list';
import { CreateFeedItemForm } from './create-feed-item-form';
import { FeedItem } from '../../common/models/feed';

export const NewsFeedPage: React.FC<{}> = provide({
    singletons: [FeedStore, FeedApi, FeedContext]
})(
    observer(() => {
        const [feedStore] = useDependencies(FeedStore);

        React.useEffect(() => {
            console.log('effect');
            feedStore.loadFeed();
        }, [feedStore]);

        const deleteItem = (item: FeedItem) => {
            feedStore.removeFeedItem(item.id);
        };

        const editItem = (item: FeedItem) => {
            feedStore.setEditItemData(item);
            feedStore.toggleEditModal();
        };

        const renderModal = (
            title: string,
            formState: EditFormType | CreateFormType,
            isOpen: boolean,
            toggleOpen: () => void,
            save: () => void
        ) => {
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
        };

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
        } = feedStore;
        return (
            <MainLayout>
                <div className="m-b-2 d-f justify-content-center">
                    <Button primary onClick={toggleCreateModal} className="align-self-center">
                        Create New
                    </Button>
                </div>
                <FeedList data={feed} onDelete={deleteItem} onEdit={editItem} />
                {renderModal(
                    'Create Post',
                    createItemForm,
                    isCreateModalOpen,
                    toggleCreateModal,
                    createFeedItem
                )}
                {renderModal(
                    'Edit Post',
                    editItemForm,
                    isEditModalOpen,
                    toggleEditModal,
                    updateFeedItem
                )}
            </MainLayout>
        );
    })
);
