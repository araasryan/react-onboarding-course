import { FeedItem } from '../../common/models/feed';
import { AxiosResponse } from 'axios';
import { injectable, inject } from '@servicetitan/react-ioc';
import { FeedContext } from '../../common/mocks/feed.db';
import { mockResponse } from '../../common/mocks/utils';
import { UserContext } from '../../common/mocks/users.db';
import { User } from '../../common/models/user';

interface IFeedApi {
    getAll(): Promise<AxiosResponse<FeedItem[] | undefined>>;
    create(item: Partial<FeedItem>, authorId: number): Promise<AxiosResponse<FeedItem | undefined>>;
    update(id: number, feed: Partial<FeedItem>): Promise<AxiosResponse<FeedItem | undefined>>;
    delete(id: number): Promise<AxiosResponse<FeedItem | undefined>>;
}

@injectable()
export class FeedApi implements IFeedApi {
    constructor(
        @inject(FeedContext) private feedContext: FeedContext,
        @inject(UserContext) private userContext: UserContext
    ) {}

    async getAll(): Promise<AxiosResponse<FeedItem[] | undefined>> {
        const feed = this.feedContext.findAll();
        const users = this.userContext.findAll().reduce((acc, u): Map<string, User> => {
            acc.set(u.id!, {
                login: u.login,
                id: u.id,
                userRole: u.userRole
            });
            return acc;
        }, new Map());

        feed.forEach(f => (f.author = users.get(f.authorId)));

        return mockResponse(feed, 200);
    }

    async create(
        item: Partial<FeedItem>,
        authorId: number
    ): Promise<AxiosResponse<FeedItem | undefined>> {
        item.authorId = authorId;
        const createdItem = this.feedContext.create(item);
        if (createdItem) {
            return mockResponse(createdItem, 201);
        }
        return mockResponse(undefined, 400);
    }

    async update(
        id: number,
        feed: Partial<FeedItem>
    ): Promise<AxiosResponse<FeedItem | undefined>> {
        const updatedItem = this.feedContext.update(id, feed);
        if (updatedItem) {
            return mockResponse(updatedItem, 200);
        }
        return mockResponse(undefined, 400);
    }

    delete(id: number): Promise<AxiosResponse<FeedItem | undefined>> {
        const toDeleteItem = this.feedContext.findById(id);
        const deleted = this.feedContext.delete(id);

        if (deleted) {
            return mockResponse(toDeleteItem, 200);
        }
        return mockResponse(undefined, 400);
    }
}
