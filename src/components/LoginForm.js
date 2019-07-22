import React, { Component } from 'react';
import { View, Text, Alert, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem, Button, Input, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import DeviceInfo from 'react-native-device-info';

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

  onEmailChange(text){
    this.props.emailChanged(text);
  }

  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  onLoginPress(){
    const { email, password, navigation } = this.props;

    this.props.loginUser({ email, password, navigation });

  }

  renderError(){
    if (this.props.error) {
      return (
          <Text style={{ fontSize: 20, alignSelf: 'center', color: 'red', marginBottom: 10 }}>
            {this.props.error}
          </Text>
      )
    }
  }

  writeToClipboard = async () => {
    await Clipboard.setString(DeviceInfo.getUniqueID());
    alert('Copied to Clipboard!');
  };


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

      <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#f0f8ff'}}>
        <Image
          source={require('../images/logo2.png')}
          style = {{ alignSelf: 'center', width: 200, height: 130, marginBottom: -30 }}
        />
        <Card
          containerStyle={{ backgroundColor: '#FF000000', borderWidth: 0, alignSelf: 'center', borderRadius: 50, padding: 20, width: '80%', shadowOpacity: 0, elevation: 0 }}
        >
          <Input
            onFocus={this.handleFocusEmail}
            onBlur={this.handleBlurEmail}
            placeholder='Email'
            placeholderTextColor= {this.state.isEmailFocused ? '#007AFF' : '#CCE4FF'}
            leftIcon={{ type: 'antdesign', name: 'user', color: this.state.isEmailFocused ? '#007AFF' : '#CCE4FF' }}
            leftIconContainerStyle={{ marginRight: 10, marginLeft: 5}}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            containerStyle={{ marginBottom: 10, borderWidth: 1, borderRadius: 20, borderColor: this.state.isEmailFocused ? '#007AFF' : '#CCE4FF' }}
            onChangeText={this.onEmailChange.bind(this)}
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
            containerStyle={{ marginBottom: 10, borderWidth: 1, borderRadius: 20, borderColor: this.state.isPasswordFocused ? '#007AFF' : '#CCE4FF' }}
            secureTextEntry= {true}
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />

          <View>
            {this.renderError()}
          </View>

          <Button
            onPress={this.onLoginPress.bind(this)}
            buttonStyle={{ backgroundColor:'#007AFF', alignSelf: 'center', width: '80%', height: 50, borderRadius: 20, marginLeft: 0, marginRight: 0 }}
            title='LOGIN'
            loading={this.props.loading}
          />

        </Card>

        <View style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto' }}>
          <Text onPress={()=> this.alertDeviceInfo()}>Need Your Device ID?</Text>
        </View>

      </View>
    );
  }
}

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
