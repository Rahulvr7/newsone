import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../models/navigation.model";
import { StackNavigationProp } from "@react-navigation/stack";

type NewsDetailRouteProp = RouteProp<RootStackParamList, "NewsDetail">;
type NewsDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewsDetail"
>;

interface NewsDetailProps {
  route: NewsDetailRouteProp;
}

const NewsDetail = ({ route }: NewsDetailProps) => {
  const { article } = route.params;
  const [showMore, setShowMore] = useState(false);

  const description = article.description ?? "";
  const maxLength = 150;
  const truncatedDescription = description.slice(0, maxLength);
    const displayDescription = showMore ? description : truncatedDescription;
    const navigation = useNavigation<NewsDetailNavigationProp>();

    const handleOpenArticle = (url: string, title: string) => {
        navigation.navigate("WebViewScreen", { url, title });
    };

  return (
    <ScrollView style={styles.container}>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
          )}
          <TouchableOpacity onPress={() => handleOpenArticle(article.url, article.title)}>        
      <Text style={styles.title}>{article.title}</Text>
          </TouchableOpacity>
      <View style={styles.subHeader}>
        <Text style={styles.date}>
          {new Date(article.publishedAt).toDateString()}
        </Text>
        {article.author && (
          <Text style={styles.author} numberOfLines={1}>by {article.author}</Text>
        )}
      </View>
      <Text style={styles.content}>{displayDescription}</Text>
      {description.length > maxLength && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowMore(!showMore)}
        >
          <Text style={styles.moreButtonText}>
            {showMore ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#14171A",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 10,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#B0B3B8",
  },
  author: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  content: {
    fontSize: 16,
    color: "#B0B3B8",
  },
  moreButton: {
    padding: 5,
    backgroundColor: "#1DA1F2",
    borderRadius: 5,
    width: 120,
    height: 35,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default NewsDetail;
