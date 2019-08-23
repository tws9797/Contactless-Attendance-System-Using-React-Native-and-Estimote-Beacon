import LoginForm from './components/LoginForm';
import HomeScreen from './components/HomeScreen';
import RecordScreen from './components/RecordScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

//StackNavigator provided with back button
export const AuthStack = createStackNavigator({ Login: LoginForm });
export const TabStack = createBottomTabNavigator(
  { Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Home',
      tabBarIcon:({tintColor})=>(
          <Icon name="home" type="font-awesome" color={tintColor} size={27}/>
      )
    }
  }, Record: {
     screen: RecordScreen,
     navigationOptions: {
       title: 'Records',
       tabBarIcon:({tintColor})=>(
           <Icon name="bars" type="font-awesome" color={tintColor} size={27}/>
       )
     }
   },
 }, {
   tabBarOptions: {
   labelStyle: {
     fontSize: 12,
     paddingBottom: 5
   },
   style: {
     height: 60,
     borderTopColor: "transparent",
     paddingTop: 5,
     elevation: 20
   }
 }
});

export const AppStack = createAppContainer(TabStack);

//SwitchNavigator only ever shows one screen at a time
export const AppNavigator = createSwitchNavigator(
  {
    //Naming for each screen
    AuthLoading: AuthLoadingScreen,
    App: TabStack,
    Auth: AuthStack,
  },
  {
    //Initial screen
    initialRouteName: 'AuthLoading',
  }
)
