import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser } from '../actions';

class LoginForm extends Component {

  onEmailChange(text){
    this.props.emailChanged(text);
  }

  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  onButtonPress(){
    const { email, password } = this.props;

    this.props.loginUser({ email, password });
  }

  renderError(){
    if (this.props.error) {
      return (
          <Text style={{ fontSize: 20, alignSelf: 'center', color: 'red' }}>
            {this.props.error}
          </Text>
      )
    }
  }


  render(){
    return (
      <View style={{ flex: 1}}>
      <Card title='Utar Attendance'>

        <Input
          placeholder='EMAIL'
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          leftIconContainerStyle={{ marginRight: 10}}
          containerStyle={{ marginBottom: 10 }}
          onChangeText={this.onEmailChange.bind(this)}
          value={this.props.email}
        />

        <Input
          placeholder='PASSWORD'
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          leftIconContainerStyle={{ marginRight: 10}}
          containerStyle={{ marginBottom: 10 }}
          secureTextEntry= {true}
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.props.password}
        />

        <View>
          {this.renderError()}
        </View>

        <Button
          onPress={this.onButtonPress.bind(this)}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginTop: 10, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='LOGIN'
          loading={this.props.loading}
        />

      </Card>
      </View>
    );
  }
}

//Get the new state from the AuthReducer as props to this component
const mapStateToProps = ({ auth }) => {

  const { email, password, error, loading } = auth;

  return { email, password, error, loading };
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
