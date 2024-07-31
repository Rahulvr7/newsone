import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY!;

export type ApiParams = {
    q: string;
    sortBy: string;
    apiKey: string;
    page: number;
    pageSize: number;
    language: string;
}

export const fetchNews = async (
    query: string = '', 
    sortBy: string = 'publishedAt', 
    page: number = 1, 
    pageSize: number = 10
) => {
    const params: ApiParams = {
        q: query || 'latest',
        sortBy: sortBy,
        apiKey: API_KEY,
        page: page,
        pageSize: pageSize,
        language: 'en'
    };
    try {
        const response = await axios.get(`${BASE_URL}/everything`, { params });
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news');
        return [];
    }
};
