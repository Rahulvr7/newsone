export interface Article {
    title: string;
    author?: string;
    description?: string;
    content?: string;
    urlToImage?: string;
    url: string;
    publishedAt: string;
};

export enum SortOption {
    ByDay = 'byDay',
    ByMonth = 'byMonth',
    ByYear = 'byYear'
};