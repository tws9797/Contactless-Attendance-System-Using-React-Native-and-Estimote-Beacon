import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
 } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-spinkit';
import { getUserToken } from '../actions';

class AuthLoadingScreen extends Component {

  static navigationOptions = {
      header: null,
  };

  componentDidMount(){
    this._bootstrapAsync();
  }

  _bootstrapAsync = () => {
    this.props.getUserToken(this.props.navigation);
  }

  render() {
      return (
          <View style={styles.container}>
              <Spinner
                type = 'Circle'
                size = {60}
                color = '#007AFF'
              />
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
