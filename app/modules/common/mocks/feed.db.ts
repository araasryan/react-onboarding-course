import { injectable } from '@servicetitan/react-ioc';
import { FeedItem } from '../models/feed';
import * as StorageManager from './storage-manager';
import { cloneDeep } from '../utils/clone-deep';

type NullableFeedItem = FeedItem[] | undefined;

const createDefaultFeedItem = (): FeedItem => {
    return {
        description: '',
        title: '',
        id: 0,
        authorId: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

@injectable()
export class FeedContext {
    private feed: FeedItem[];
    constructor() {
        const storageData: NullableFeedItem = StorageManager.getObject('feed');
        this.feed = !!storageData ? storageData : [];
    }
    private syncChanges() {
        StorageManager.setObject('feed', this.feed);
    }

    private get nextId() {
        const maxId = Math.max(...this.feed.map(f => f.id), 0);
        return maxId + 1;
    }

    findAll(): FeedItem[] {
        return this.feed;
    }

    findById(id: number): FeedItem | undefined {
        return this.feed.find(a => a.id === id);
    }

    findByTitle(title: String): FeedItem | undefined {
        return this.feed.find(f => f.title === title);
    }

    findIndexById(id: number): number {
        return this.feed.findIndex(f => f.id === id);
    }

    create(item: Partial<FeedItem>): FeedItem | undefined {
        if (item.title) {
            const existing = this.findByTitle(item.title);
            if (existing) {
                return undefined;
            }
        }
        const itemDb = cloneDeep(item);
        itemDb.id = this.nextId;
        const emptyItem = createDefaultFeedItem();
        const itemToSave = { ...emptyItem, ...itemDb };

        this.feed.push(itemToSave);

        this.syncChanges();
        return itemToSave;
    }

    update(id: number, feed: Partial<FeedItem>): FeedItem | undefined {
        if (feed.id !== undefined && feed.id !== id) {
            return undefined;
        }

        const dbFeed = this.findById(id);
        if (!dbFeed) {
            return undefined;
        }
        feed.updatedAt = new Date();
        const updatedFeed = { ...dbFeed, ...feed };
        const index = this.findIndexById(id);
        this.feed.splice(index, 1, updatedFeed);

        this.syncChanges();
        return updatedFeed;
    }

    delete(id: number): boolean {
        const index = this.findIndexById(id);
        if (index === -1) {
            return false;
        }

        this.feed.splice(index, 1);

        this.syncChanges();
        return true;
    }
}
