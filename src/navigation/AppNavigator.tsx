import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import NewsFeed from '../components/NewsFeed';

const Stack = createStackNavigator();

const AppNavigator = () => {
return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="NewsFeed">
        <Stack.Screen name="NewsFeed" component={NewsFeed} options={{
            title: 'News One',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#1DA1F2',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }} />
    </Stack.Navigator>
    </NavigationContainer>
);
};

export default AppNavigator;
