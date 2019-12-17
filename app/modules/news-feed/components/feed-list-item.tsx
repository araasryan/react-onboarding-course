import * as React from 'react';
import { Card, Stack, Avatar, Popover, Button } from '@servicetitan/design-system';
import * as moment from 'moment';
import { FeedItem } from '../../common/models/feed';
import { Confirm } from '../../common/components/confirm';

export const FeedListItem: React.FC<{
    item: FeedItem;
    onDelete: (item: FeedItem) => void;
    onEdit: (item: FeedItem) => void;
}> = ({ item, onDelete: handleDelete, onEdit: handleEdit }) => {
    const author = item.author!;
    const [open, setIsOpen] = React.useState(false);

    const togglePopover = () => {
        setIsOpen(!open);
    };

    const deleteItem = () => {
        handleDelete(item);
    };

    const editItem = () => {
        handleEdit(item);
    };

    return (
        <Card className="m-t-4">
            <Card.Section>
                <h3 className="m-b-2 fs-4">{item.title}</h3>
                <p>{item.description}</p>
            </Card.Section>
            <Card.Section light>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row">
                        <Avatar name={author.login} />
                        <Stack direction="column" className="m-l-2">
                            <p>{author.login}</p>
                            <p className="fs-1 m-t-1">{moment(item.createdAt).fromNow()}</p>
                        </Stack>
                    </Stack>
                    <div>
                        <Popover
                            open={open}
                            trigger={
                                <Button fill="none" onClick={togglePopover} iconName="more_horiz">
                                    <></>
                                </Button>
                            }
                            direction="br"
                            width="auto"
                            padding="s"
                            sharp
                        >
                            <div>
                                <Button fill="none" type="button" onClick={editItem}>
                                    Edit
                                </Button>
                                <Confirm onConfirm={deleteItem}>
                                    {handler => (
                                        <Button fill="none" type="button" onClick={handler}>
                                            Delete
                                        </Button>
                                    )}
                                </Confirm>
                            </div>
                        </Popover>
                    </div>
                </Stack>
            </Card.Section>
        </Card>
    );
};
