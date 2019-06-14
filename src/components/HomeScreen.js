import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class HomeScreen extends Component{
  componentWillMount(){
    console.log(this.props.email);
  }
  render(){
    return(
      <View>
        <Text>
          Hello World!!!!
        </Text>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => {

  const { email, password, error, loading, token } = auth;

  return { email, password, error, loading, token };
};


export default connect(mapStateToProps)(HomeScreen);
