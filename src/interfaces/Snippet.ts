export default interface Snippet {
    id?: string;
    name: string;
    content: string;
    description: string;
    tags: string[];
    countCopy: number;
    countStar: number;
    author?: {
        uid: string;
        displayName?: string | null;
    };
}
