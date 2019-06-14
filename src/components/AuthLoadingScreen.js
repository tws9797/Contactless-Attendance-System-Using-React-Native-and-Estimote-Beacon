import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
 } from 'react-native';
import { connect } from 'react-redux';
import { getUserToken } from '../actions';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends Component {

  static navigationOptions = {
      header: null,
  };

  componentDidMount(){
    this._bootstrapAsync();
  }

  _bootstrapAsync = () => {
    this.props.getUserToken().then(() => {
      this.props.navigation.navigate(this.props.token !== null ? 'App' : 'Auth');
    })
    .catch(error => console.log(error));
  }

  render() {
      return (
          <View style={styles.container}>
              <ActivityIndicator />
              <StatusBar barStyle="default" />
          </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const mapStateToProps = ({ auth }) => {

  const { token } = auth;
  return { token };

};


export default connect(mapStateToProps, { getUserToken })(AuthLoadingScreen);
