import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import NewsFeed from "../components/NewsFeed";
import WebViewScreen from "../components/WebViewScreen";
import { RootStackParamList } from "../models/navigation.model";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="NewsFeed">
        <Stack.Screen
        name="NewsFeed"
        component={NewsFeed}
        options={{
            title: "News One",
            headerTitleAlign: "center",
            headerStyle: {
            backgroundColor: "#1DA1F2",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
            fontWeight: "bold",
            },
        }}
        />
            <Stack.Screen name="WebViewScreen" component={WebViewScreen}
        options={({ route }) => ({
            title: route.params?.title || 'Article',
            headerStyle: {
            backgroundColor: '#1DA1F2',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        })}    />
    </Stack.Navigator>
    </NavigationContainer>
);
};

export default AppNavigator;
