import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, TextInput, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchNews } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../models/navigation.model';

type NewsFeedNavigationProp = StackNavigationProp<RootStackParamList, 'NewsFeed'>;

const NewsFeed = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('publishedAt');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NewsFeedNavigationProp>();

  const fetchAndSetNews = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    const newsArticles = await fetchNews(query, sortBy, page);
    const filteredArticles = newsArticles.filter((article: { title: string; }) => article.title !== '[Removed]');
    if (reset) {
      setArticles(filteredArticles);
    } else {
      setArticles(prevArticles => [...prevArticles, ...filteredArticles]);
    }
    setHasMore(filteredArticles.length > 0);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAndSetNews(true);
  }, [query, sortBy]);

  useEffect(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    setDisplayedArticles(articles.slice(start, end));
  }, [page, articles]);

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1 && !loading) {
      setPage(prevPage => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchAndSetNews();
  }, [page]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchAndSetNews(true);
  }, [query, sortBy]);

  const shouldShowPaginator = articles.length >= 10;

  const handleOpenArticle = (url: string, title: string) => {
    navigation.navigate('WebViewScreen', { url, title });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={setQuery}
          value={query}
          placeholderTextColor="#FFFFFF"
        />
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(itemValue) => setSortBy(itemValue)}
        >
          <Picker.Item label="Latest" value="publishedAt" />
          <Picker.Item label="Popularity" value="popularity" />
        </Picker>
      </View>
      <FlatList
        data={displayedArticles}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.article}
            onPress={() => handleOpenArticle(item.url, item.title)}
          >
            {item.urlToImage && (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.urlToImage && item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#1DA1F2" />
          ) : shouldShowPaginator ? (
            <View style={styles.pagination}>
              <TouchableOpacity
                onPress={handlePreviousPage}
                disabled={page === 1 || loading}
                style={[styles.pageButton, page === 1 && styles.disabledButton]}
              >
                <Text style={styles.pageButtonText}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.pageNumberText}>{`Page ${page}`}</Text>
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={!hasMore || loading}
                style={[styles.pageButton, !hasMore && styles.disabledButton]}
              >
                <Text style={styles.pageButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171A',
  },
  header: {
    padding: 10,
    backgroundColor: '#1DA1F2',
    borderBottomWidth: 1,
    borderBottomColor: '#1A91DA',
    flexDirection: 'column',
  },
  searchInput: {
    height: 40,
    borderColor: '#ffffff80',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    backgroundColor: '#1B1D1F',
  },
  picker: {
    height: 50,
    width: 180,
    color: '#FFFFFF',
  },
  article: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#B0B3B8',
    marginLeft: 10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#1B1D1F',
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#1DA1F2',
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  pageButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  pageNumberText: {
    fontSize: 18,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
});

export default NewsFeed;
