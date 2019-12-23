import * as React from 'react';
import { FeedItem } from '../../common/models/feed';
import { FeedListItem } from './feed-list-item';
import { observer } from 'mobx-react';

export const FeedList: React.FC<{
    data: FeedItem[] | undefined;
    onDelete: (item: FeedItem) => void;
    onEdit: (item: FeedItem) => void;
}> = observer(({ data, onDelete: handleDelete, onEdit: handleEdit, ...props }) => {
    if (!data) {
        return null;
    }

    const deleteItem = (item: FeedItem) => {
        handleDelete(item);
    };
    const editItem = (item: FeedItem) => {
        handleEdit(item);
    };

    return (
        <div {...props}>
            {data.map(d => (
                <FeedListItem onDelete={deleteItem} onEdit={editItem} key={d.id} item={d} />
            ))}
        </div>
    );
});
