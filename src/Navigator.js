import LoginForm from './components/LoginForm';
import HomeScreen from './components/HomeScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

//StackNavigator provided with back button
export const AppStack = createStackNavigator({  Home: HomeScreen });
export const AuthStack = createStackNavigator({ Login: LoginForm });

//SwitchNavigator only ever shows one screen at a time
export const AppNavigator = createSwitchNavigator(
  {
    //Naming for each screen
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    //Initial screen
    initialRouteName: 'AuthLoading',
  }
)
