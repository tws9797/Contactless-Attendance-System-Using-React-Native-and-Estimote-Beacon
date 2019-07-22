import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Card, ListItem, Button, Input } from 'react-native-elements';
import { getUserInfo, getNextClass, startProximityObserver, toggleModal, dismissModal, stopProximityObserver, checkCurrentLocation } from '../actions';
import { connect } from 'react-redux';
import firebase from 'firebase';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import * as RNEP from "@estimote/react-native-proximity";
import BackgroundTimer from '../BackgroundTimer';
import { BluetoothStatus } from 'react-native-bluetooth-status';

class HomeScreen extends Component {

  static navigationOptions = {
    header: null
  }

  componentDidMount(){
    this.props.getNextClass();
  }


  enableModal(){
    this.setState({modalVisible: true});
  }

  startProximityObserver(){
    let hours = this.props.endTime - this.props.startTime;
    let criteria = hours * 6;
    this.props.startProximityObserver(this.props.room, criteria);
  }

  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if(isEnabled){
      this.startProximityObserver();
    }
    else {
      this.setModalVisible(true);
    }

  }

  renderStatus(){
    if(!this.props.loading){
      if(this.props.status == 1){
        var time = moment(this.props.startTime, 'hh').format('hh:mm A') + " - " + moment(this.props.endTime, 'hh').format('hh:mm A');

        textRendered = (
          <View style={{flex: 1, flexDirection: 'column'}}>
              <View>
                <Text style={{ fontSize: 16, color: '#d3d3d3', fontWeight: '100', letterSpacing: 2 }}>Status</Text>
                <Text style={{fontSize: 20, letterSpacing: 0.5, lineHeight: 26, marginBottom: 10}}>In Class</Text>
                <Text style={{ fontSize: 16, color: '#d3d3d3', fontWeight: '100', letterSpacing: 2 }}>Room</Text>
                <Text style={{fontSize: 20, letterSpacing: 0.5, lineHeight: 26, marginBottom: 10}}>{this.props.room}</Text>
                <Text style={{ fontSize: 16, color: '#d3d3d3', fontWeight: '100', letterSpacing: 2 }}>Class</Text>
                <Text style={{fontSize: 20, letterSpacing: 0.5, lineHeight: 26, marginBottom: 10}}>{this.props.className}</Text>
                <Text style={{ fontSize: 16, color: '#d3d3d3', fontWeight: '100', letterSpacing: 2 }}>Duration</Text>
                <Text style={{fontSize: 20, letterSpacing: 0.5, lineHeight: 26, marginBottom: 10 }}>{time}</Text>
                <Text style={{ fontSize: 16, color: '#d3d3d3', fontWeight: '100', letterSpacing: 2 }}>Status</Text>
                <Text style={{fontSize: 20, letterSpacing: 0.5, lineHeight: 26, marginBottom: 20 }}>{this.props.attendanceTaken? 'Completed' : 'Incomplete'}</Text>
              </View>
              <Button
                onPress={this.getBluetoothState.bind(this)}
                containerStyle={{alignSelf: 'center'}}
                buttonStyle={{ backgroundColor:'#007AFF', height: 50, width: 180, borderRadius: 20, marginLeft: 0, marginRight: 0 }}
                title='Take Attendance'
                disabled={this.props.attendanceTaken}
              />
          </View>
        )
      } else {
        textRendered = (
          <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={{fontSize: 24, letterSpacing: 0.5, lineHeight: 26, marginBottom: 10}}>No Class</Text>
          </View>
        )
      }

      return textRendered;
    }
    else{
      return <View style = {{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="small" color="#007AFF" /></View>;
    }
  }

  refresh(){
    this.props.getNextClass();
  }

  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderAttendance(){
    if(this.props.checking){
      textRendered = (<Text alignSelf='center'>Please go to {this.props.room}...</Text>)
    } else{
      if(this.props.inClass){
        textRendered = (<Text alignSelf='center'>Updating attendance...</Text>)
      } else {
        textRendered = (<Text alignSelf='center'>You are not in the range...</Text>)
      }
    }
    return textRendered;
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f8ff', alignItems: 'center' }}>

          <Card containerStyle={{ width: '100%', margin: 0,  borderWidth: 0, elevation: 0, backgroundColor: '#007AFF' }}>
            <Text style={{ alignSelf: 'center', fontSize: 18, color: '#FFFFFF', fontWeight: '100', letterSpacing: 2 }}>
              {moment(new Date()).format("MMMM D, YYYY")}
            </Text>
            <Text style={{  alignSelf: 'center', fontSize: 36, color: '#FFFFFF', fontWeight: 'bold', letterSpacing: 0.5, lineHeight: 40 }}>
              {moment(new Date()).format("dddd")}
            </Text>
            <Button
              icon=  {{name: 'refresh', type:'font-awesome',color: "#FFFFFF"}}
              onPress={this.refresh.bind(this)}
              containerStyle={{position: 'absolute', right: 0, top: 10, bottom: 0}}
              type="clear"
            />
          </Card>

          <Card containerStyle={{ height: 400, flexDirection: 'column', borderWidth: 1, alignSelf: 'center', borderRadius: 30, padding: 20, width: '90%', shadowOpacity: 0.6, shadowRadius: 2, elevation: 10 }}>
            <View style={{height: '100%'}}>
              {this.renderStatus()}
            </View>
        </Card>

        <Modal
          isVisible={this.props.isModalVisible}
          backdropOpacity={0.5}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
            <View style={{ alignItems:'center', padding: 80, backgroundColor: '#FFFFFF', borderRadius: 50}} >
              <ActivityIndicator size="small" color="#007AFF" style={{ padding: 10 }} />
              <Text alignSelf='center'>{this.renderAttendance()}</Text>
              <Text>{this.props.time}</Text>
            </View>
        </Modal>
        <Modal
          isVisible={this.state.modalVisible}
          backdropOpacity={0.5}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
            <View style={{ alignItems:'center', padding: 80, backgroundColor: '#FFFFFF', borderRadius: 50}} >
                  <Text alignSelf='center'>Please turn on bluetooth</Text>
                  <Button
                    onPress={() => {this.setModalVisible(false)}}
                    containerStyle={{alignSelf: 'center'}}
                    buttonStyle={{ backgroundColor:'#007AFF', height: 50, width: 180, borderRadius: 20, marginLeft: 0, marginRight: 0 }}
                    title='Try Again'
                  />
            </View>
        </Modal>
      </View>
    );
  }

}

const mapStateToProps = ({ att }) => {
  const {
    name,
    studID,
    className,
    startTime,
    endTime,
    status,
    loading,
    disable,
    room,
    time,
    inClass,
    attStatus,
    isModalVisible,
    attendanceTaken,
    checking,
    location
  } = att;

  return {
    name,
    studID,
    className,
    startTime,
    endTime,
    status,
    loading,
    disable,
    room,
    time,
    inClass,
    attStatus,
    isModalVisible,
    attendanceTaken,
    checking,
    location
  };
}


export default connect(mapStateToProps, { checkCurrentLocation, getUserInfo, getNextClass, startProximityObserver, toggleModal, dismissModal, stopProximityObserver })(HomeScreen);
