import React, { Component } from 'react';
import { View, Text, Alert, Clipboard, StyleSheet } from 'react-native';
import { Card, ListItem, Button, Input, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import DeviceInfo from 'react-native-device-info';
import { Error, Picture, Container, ButtonStyle } from '../styles';

class LoginForm extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmailFocused: false,
      isPasswordFocused: false
    };
  }

  //Handle email input
  onEmailChange(text){
    this.props.emailChanged(text);
  }

  //Handle password input
  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  //Handle login press
  onLoginPress(){
    const { email, password, navigation } = this.props;

    this.props.loginUser({ email, password, navigation });

  }

  //Render error
  renderError(){
    if (this.props.error) {
      return (
          <Text style={styles.error}>
            {this.props.error}
          </Text>
      )
    }
  }

  //Copy the device ID to clipboard
  writeToClipboard = async () => {
    await Clipboard.setString(DeviceInfo.getUniqueID());
    alert('Copied to Clipboard!');
  };

  //Provide user device ID
  alertDeviceInfo(){
    Alert.alert(
      'Your Device ID',
      DeviceInfo.getUniqueID(),
      [
        {text: 'COPY', onPress: () => this.writeToClipboard()},
      ],
      {cancelable: false},
    );
  }

  handleFocusEmail = () => this.setState({isEmailFocused: true})

  handleBlurEmail = () => this.setState({isEmailFocused: false})

  handleFocusPassword = () => this.setState({isPasswordFocused: true})

  handleBlurPassword = () => this.setState({isPasswordFocused: false})

  render(){

    return (

      <View style={styles.loginScreenContainer}>

        <Image
          source={require('../images/logo2.png')}
          style = {styles.logoImage}
        />

        <Card
          containerStyle={styles.loginFormContainer}
        >
          <Input
            onFocus={this.handleFocusEmail}
            onBlur={this.handleBlurEmail}
            placeholder='Email'
            placeholderTextColor= {this.state.isEmailFocused ? '#007AFF' : '#CCE4FF'}
            leftIcon={{ type: 'antdesign', name: 'user', color: this.state.isEmailFocused ? '#007AFF' : '#CCE4FF' }}
            leftIconContainerStyle={{ marginRight: 10, marginLeft: 5}}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            containerStyle={[styles.inputContainer, {borderColor: this.state.isEmailFocused ? '#007AFF' : '#CCE4FF'}]}
            onChangeText={this.onEmailChange.bind(this)}
            editable={!this.props.loading}
            value={this.props.email}
          />

          <Input
            onFocus={this.handleFocusPassword}
            onBlur={this.handleBlurPassword}
            placeholder='Password'
            placeholderTextColor={this.state.isPasswordFocused ? '#007AFF' : '#CCE4FF'}
            leftIcon={{ type: 'antdesign', name: 'lock', color: this.state.isPasswordFocused ? '#007AFF' : '#CCE4FF' }}
            leftIconContainerStyle={{ marginRight: 10, marginLeft: 5}}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            containerStyle={[styles.inputContainer, {borderColor: this.state.isPasswordFocused ? '#007AFF' : '#CCE4FF'}]}
            secureTextEntry= {false}
            onChangeText={this.onPasswordChange.bind(this)}
            editable={!this.props.loading}
            value={this.props.password}
          />

          <View>
            {this.renderError()}
          </View>

          <Button
            onPress={this.onLoginPress.bind(this)}
            buttonStyle={styles.loginButton}
            title='LOGIN'
            disabled={this.props.loading}
            disabledStyle={styles.loginButton}
            loading={this.props.loading}
          />
        </Card>

        <View style={styles.deviceIDContainer}>
          <Text onPress={()=> this.alertDeviceInfo()}>Need Your Device ID?</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    ...Error.text
  },
  logoImage: {
    ...Picture.logoImage
  },
  loginScreenContainer: {
    ...Container.loginScreenContainer
  },
  loginFormContainer: {
    ...Container.loginFormContainer
  },
  inputContainer: {
    ...Container.inputContainer
  },
  deviceIDContainer: {
    ...Container.deviceIDContainer
  },
  loginButton: {
    ...ButtonStyle.loginButton
  }
});

//Get the new state from the AuthReducer as props to this component
const mapStateToProps = ({ auth }) => {

  const { email, password, error, loading, user } = auth;

  return { email, password, error, loading, user };
};

//Connect the reducer with this component
export default connect(mapStateToProps, {
  //The function from actions that we want to use
  emailChanged, passwordChanged, loginUser
})(LoginForm);

//User types something
//Call ActionCreator with new test input
//Action Creator returns an action
//Action sent to all reducers
//Reducer calculates new app state
//State sent to all components
//Components rerender with new state
//Input value set to 'this.props.email'
