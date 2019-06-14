import LoginForm from './components/LoginForm';
import HomeScreen from './components/HomeScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

export const AppStack = createStackNavigator({ Home: HomeScreen });
export const AuthStack = createStackNavigator({ Login: LoginForm });

export const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
)
