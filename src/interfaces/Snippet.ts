export default interface Snippet {
    id?: string;
    name: string;
    content: string;
    description: string;
    countStar: number;
    author?: {
        uid: string;
        displayName?: string | null;
    };
}
