import Placeholder, { Line, Media } from "rn-placeholder";
import React, { Component } from 'react';
import { Text } from 'react-native';


class HomeLoadingScreen extends Component {

render(){

    const isReady = false;

    return (
      <Placeholder
        isReady={isReady}
        animation="fade"
        whenReadyRender={() => {return <Text>ffsdfsd</Text>;}}
      >
        <Line width="70%" />
        <Line />
        <Line />
        <Line width="30%" />
      </Placeholder>
    );
  };
}

export default HomeLoadingScreen;
