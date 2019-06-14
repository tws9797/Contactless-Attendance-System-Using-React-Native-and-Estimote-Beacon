import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import LoginForm from './components/LoginForm';
import { createAppContainer } from 'react-navigation';
import { AppNavigator } from './Navigator';

const Navigator = createAppContainer(AppNavigator);

class App extends Component {

  render(){
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <View style={{ flex:1 }}>
          <Navigator />
        </View>
      </Provider>
    );
  }
}

export default App;

/**
Redux is a predictable state container for JavaScript apps.
The function of Redux is to organizing application states.
The major components for Redux: reducers, actions, action creators and store.
Reducer:
Function that takes the previous state and an action as arguments and returns a new state.
Reducers specify how the application's state chages in response to actions that are dispatched to the store.
Actions:
Actions are plain JavaScript objects that represent payloads of information that send data from your application to your store.
Actions have a type and an optional payload.
Actions mostly triggered by user directly or indirectly that generate changes on application states.
Actions are often dispatched using an action creator.
Action Creators:
Function that returns an action object.
The action object returned from an action creator is sent to all of the different reducers in the app.
combineReducers:
Function that calls all reducers with the slice of state selected according to their key.
Combines the results into a single object once again.
Store:
There is only a single store in a Redux application.
Store refers to the object that brings actions and reducers together.
Allow access to state via getState().
Allow state to be updated via dispatch(action).
Holds the whole application state.
**/

/**
4 Main Steps of the Data Lifecycle in Redux
1. Event inside app triggers store to dispatch an action
2. Redux store calls the root reducer with the current state and the action
3. The root reducer combines the output of multiple reducers into a single state tree.
4. Root reducer will call all reducers and combine all sets of results into a single state tree.
5. The Redux store saves the complete state tree returned by the root reducer. The new state tree is now the nextState of your app.
**/
