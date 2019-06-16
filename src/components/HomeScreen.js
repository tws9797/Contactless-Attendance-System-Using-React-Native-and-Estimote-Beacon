import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Firebase from '../Firebase';

class HomeScreen extends Component{
  constructor() {
    super();
    this.state = {
      deviceId: '',
      userId: ''
    };
  }

  getdeviceId = () => {
    //Getting the Unique Id from here
    var id = DeviceInfo.getUniqueID();
    this.setState({ deviceId: id, });
    Firebase.database().ref('users/' + this.props.user.uid).set({
          deviceId: DeviceInfo.getUniqueID()
    });
  };

  accessData = () => {
      Firebase.database().ref(`users/${this.props.user.uid}/deviceId`)
      .on('value', snapshot => {
          this.setState({
            userId: snapshot.val()
          });
      });
  }

  render(){

    return(
      <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text>
            {this.props.user.uid}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
            {this.state.deviceId}
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10 }}>
            {this.state.userId}
          </Text>
          <TouchableOpacity
            onPress={this.getdeviceId}
            activeOpacity={0.5}
            style={{
                paddingTop: 10,
                paddingBottom: 10,
                width: '90%',
                backgroundColor: '#646464',
              }}>
            <Text style={{
              color: '#fff',
              textAlign: 'center',
            }}>SHOW ME THE UNIQUE ID OF DEVICE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.accessData}
            activeOpacity={0.5}
            style={{
                paddingTop: 10,
                paddingBottom: 10,
                width: '90%',
                backgroundColor: '#646464',
              }}>
              <Text style={{
                color: '#fff',
                textAlign: 'center',
              }}>SHOW ME THE DEVICE ID OF THE USER</Text>
            </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => {

  const { email, password, error, loading, user } = auth;

  return { email, password, error, loading, user };
};


export default connect(mapStateToProps)(HomeScreen);
