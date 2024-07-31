import { Article } from "./news.model";

export type RootStackParamList = {
    NewsFeed: undefined;
    NewsDetail: { article: Article };
    WebViewScreen: { url: string; title: string; };
};
