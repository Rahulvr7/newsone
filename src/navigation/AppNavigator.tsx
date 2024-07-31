import { createStackNavigator } from "@react-navigation/stack";
import NewsFeed from "../components/NewsFeed";
import NewsDetail from "../components/NewsDetail";
import { RootStackParamList } from "../models/navigation.model";
import { NavigationContainer } from "@react-navigation/native";
import WebViewScreen from "../components/WebViewScreen";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeed}
        options={{
          title: "News One",
          headerStyle: {
            backgroundColor: "#1DA1F2",
          },
          headerTitleAlign: "center",
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold"
          },
        }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetail}
        options={{
          title: "Article",
          headerStyle: {
            backgroundColor: "#1DA1F2",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={({ route }) => ({
          title: route.params?.title || "Article",
          headerStyle: {
            backgroundColor: "#1DA1F2",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
