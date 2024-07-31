import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../models/navigation.model";
import { fetchNews } from "../services/apiService";
import { Article, SortOption } from "../models/news.model";

type NewsFeedNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewsFeed"
>;

const NewsFeed = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [groupedArticles, setGroupedArticles] = useState<{
    [key: string]: Article[];
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.ByMonth);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<NewsFeedNavigationProp>();

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const newsArticles = await fetchNews(
          query,
          sortBy === SortOption.ByDay ? "publishedAt" : "relevancy",
          page
        );
        const filteredArticles = newsArticles.filter(
          (article: Article) => article.title !== "[Removed]"
        );
        setArticles(filteredArticles);
      } catch (error: any) {
        if (error?.response && error?.response.status === 0) {
          setError("No internet connection.");
        } else {
          setError("Failed to fetch news");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [query, sortBy, page]);

  useEffect(() => {
    const groupArticles = (articles: Article[], sortBy: SortOption) => {
      if (sortBy === SortOption.ByMonth) {
        return articles.reduce(
          (acc: { [key: string]: Article[] }, article: Article) => {
            const month = new Date(article.publishedAt).toLocaleString(
              "default",
              { month: "long", year: "numeric" }
            );
            if (!acc[month]) acc[month] = [];
            acc[month].push(article);
            return acc;
          },
          {}
        );
      } else if (sortBy === SortOption.ByYear) {
        return articles.reduce(
          (acc: { [key: string]: Article[] }, article: Article) => {
            const year = new Date(article.publishedAt).getFullYear().toString();
            if (!acc[year]) acc[year] = [];
            acc[year].push(article);
            return acc;
          },
          {}
        );
      } else {
        return articles.reduce(
          (acc: { [key: string]: Article[] }, article: Article) => {
            const day = new Date(article.publishedAt).toLocaleDateString();
            if (!acc[day]) acc[day] = [];
            acc[day].push(article);
            return acc;
          },
          {}
        );
      }
    };

    setGroupedArticles(groupArticles(articles, sortBy));
  }, [articles, sortBy]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setArticles([]);
  }, []);

  const handleNextPage = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1 && !loading) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSortBy = (sortOption: SortOption) => {
    setSortBy(sortOption);
    setModalVisible(false);
  };

  const handleOpenArticle = (article: Article) => {
    navigation.navigate("NewsDetail", { article });
  };

  const renderArticleItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.article}
      onPress={() => handleOpenArticle(item)}
    >
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">{item.title}</Text>
        {!item.urlToImage && item.description ? (
          <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{item.description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderGroupedArticles = () => {
    return Object.entries(groupedArticles).map(([group, articles]) => (
      <View key={group}>
        <Text style={styles.groupHeader}>{group}</Text>
        {articles.map((article, idx) => (
          <View key={article.url + idx}>
            {renderArticleItem({ item: article })}
          </View>
        ))}
      </View>
    ));
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
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#1DA1F2" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {renderGroupedArticles()}
      </ScrollView>
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={page === 1 || loading}
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
        >
          <Text style={styles.pageButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumberText}>{`Page ${page}`}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={loading}
          style={styles.pageButton}
        >
          <Text style={styles.pageButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => handleSortBy(SortOption.ByDay)}
            >
              <Text style={styles.sortOptionText}>By Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => handleSortBy(SortOption.ByMonth)}
            >
              <Text style={styles.sortOptionText}>By Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortOptionButton}
              onPress={() => handleSortBy(SortOption.ByYear)}
            >
              <Text style={styles.sortOptionText}>By Year</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14171A",
  },
  header: {
    padding: 10,
    backgroundColor: "#14171A",
    borderBottomWidth: 0.4,
    borderBottomColor: "#F5F8FA",
    flexDirection: "row",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ffffff80",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    backgroundColor: "#1B1D1F",
  },
  sortButton: {
    padding: 5,
    backgroundColor: "#1DA1F2",
    borderRadius: 10,
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sortOptionButton: {
    padding: 15,
    backgroundColor: "#1B1D1F",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333"

  },
  sortOptionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  article: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    color: "#D4D4D4",
    textAlign: "left"
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1DA1F2",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  pageButton: {
    padding: 5,
    backgroundColor: "#1DA1F2",
    borderRadius: 25, // Set to half of button height if height is 50
    width: 40, // Set width and height to ensure circular shape
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#1A91DA80",
  },
  pageButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  pageNumberText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  modalContent: {
    backgroundColor: "#14171A",
    width: "60%",
    borderRadius: 20
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    borderRadius: 20
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 10,
  },
});

export default NewsFeed;
