import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../models/navigation.model";

type WebViewScreenRouteProp = RouteProp<RootStackParamList, "WebViewScreen">;

interface WebViewScreenProps {
    route: WebViewScreenRouteProp;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ route }) => {
    const { url } = route.params;
    return (
        <View style={styles.container}>
            <WebView source={{ uri: url }} style={styles.webview} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default WebViewScreen;
