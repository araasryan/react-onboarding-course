import { User } from './user';

export interface FeedItem {
    id: number;
    title: string;
    description: string;
    authorId: number;

    createdAt: Date;
    updatedAt: Date;

    author?: Partial<User>;
}
