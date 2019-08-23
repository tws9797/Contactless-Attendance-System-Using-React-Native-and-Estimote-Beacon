import React, { Component } from 'react';
import { RefreshControl, View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Card, ListItem, Button, Input, Image, Divider  } from 'react-native-elements';
import { getUserInfo, getNextClass, getAttTime, dismissAttendanceModal, checkCurrentLocation, dismissBluetoothModal, toggleBluetoothModal } from '../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-native-modal';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import { Container, Indicator, Font, Picture, ButtonStyle } from '../styles';

class HomeScreen extends Component {

  //Hide the header
  static navigationOptions = {
    header: null
  }

  //Get user and class info when opening the app
  componentDidMount(){
    this.props.getUserInfo();
    this.props.getNextClass();
  }

  //Refresh the application
  refresh(){
    this.props.getNextClass();
  }

  //Get the bluetooth state
  async getBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    if(isEnabled){
      let hours = this.props.endTime - this.props.startTime;
      let criteria = hours * 60 * 60 * 0.5;
      this.props.getAttTime(this.props.room, this.props.courseCode, criteria, this.props.endTime);
    }
    else {
      this.props.toggleBluetoothModal();
    }
  }

  //Dismiss the Bluetooth modal
  dismissBluetoothModal(){
    this.props.dismissBluetoothModal();
  }

  //Dismiss the attendance modal
  dismissAttendanceModal(){
    this.refresh();
    this.props.dismissAttendanceModal();
  }

  //Render whether there is class or not
  renderAttendanceStatus(){
    if(!this.props.loading){
      if(this.props.status == 1){
        var time = moment(this.props.startTime, 'hh').format('HH:mm') + " to " + moment(this.props.endTime, 'hh').format('HH:mm');

        textRendered = (
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.smallFont}>
                Class
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Image
                  source = {require('../images/active.png')} style={styles.startingImage}
                />
                <Text style={styles.smallFont}>Starting</Text>
              </View>
            </View>

            <Divider style={{marginTop: 5, marginBottom: 5 }}/>

            <View style={{flexDirection: 'column'}}>
              <View style={[styles.innerClassContainer, {marginTop: 10}]}>
                <View style={styles.imageContainer}>
                  <Image containerStyle={{opacity:0.8}} source = {require('../images/school.png')} style={[styles.classImage, { padding: 5}]} />
                </View>
                <View style={styles.classInfoContainer}>
                  <Text style={styles.smallFont}>Room</Text>
                  <Text style={styles.bigFont}>{this.props.room}</Text>
                </View>
              </View>

              <View style={styles.innerClassContainer}>
                <View style={styles.imageContainer}>
                  <Image containerStyle={{opacity:0.8}} source = {require('../images/class1.png')} style={styles.classImage} />
                </View>
                <View style={styles.classInfoContainer}>
                  <Text numberOfLines={1} style={[styles.smallFont, {textTransform: 'capitalize'}]}>{this.props.className}</Text>
                  <Text style={styles.bigFont}>{this.props.courseCode}</Text>
                </View>
              </View>

              <View style={styles.innerClassContainer}>
                <View style={styles.imageContainer}>
                  <Image containerStyle={{opacity:0.8}} source = {require('../images/time.png')} style={styles.classImage} />
                </View>
                <View style={styles.classInfoContainer}>
                  <Text style={styles.smallFont}>Duration</Text>
                  <Text style={styles.bigFont}>{time}</Text>
                </View>
              </View>
              <Button
                onPress={this.getBluetoothState.bind(this)}
                containerStyle={{alignSelf: 'center'}}
                titleStyle={{ fontFamily: 'HelveticaNeueMed' }}
                buttonStyle={styles.attButton}
                title={this.props.attendanceTaken ? 'Completed' : 'Check In'}
                disabled={this.props.attendanceTaken}
              />
            </View>
          </View>
        )
      } else {
        textRendered = (
          <View style={styles.calendarErrorContainer}>
              <Image
                source = {require('../images/calendarError.png')} style={styles.calendarErrorImage}
              />
              <Text style={styles.noClassFont}>
                Oops! You have no class currently.
              </Text>
          </View>
        )
      }

      return textRendered;
    }
    else{
      return <View style={styles.classIndicator}><ActivityIndicator size="small" color="#007AFF" /></View>;
    }
  }

  //Toggle attendance modal
  toggleAttendanceModal(){
    let hours = this.props.endTime - this.props.startTime;
    let criteria = hours * 60 * 60 * 0.5;

    //Checking the zone
    if(this.props.checking){
      textRendered = (<Text>Please go to {this.props.room}...</Text>)
    } else{
      //If in the zone
      if(this.props.inClass){
        textRendered = (<Text>Updating attendance...</Text>)
      }
      //If outside the zone
      else {
        textRendered = (<Text>You are not in the range...</Text>)
      }
    }

    if(this.props.attendance){
      textReturn = (
        <View style={{alignItems:'center', padding: 30, backgroundColor: '#FFFFFF', borderRadius: 50 }} >
          <ActivityIndicator size="large" color="#007AFF" style={{ padding: 10 }} />
          <Text style={{marginBottom: 10}}>{textRendered}</Text>
          <Progress.Bar progress={this.props.time / criteria} height={10} width={150}  borderRadius={30}/>
          <Text>{this.props.time} / {criteria}</Text>
          <Text style={{marginTop: 10}}>{parseInt((this.props.time / criteria) *100)} %</Text>
        </View>
      )
    } else {
      textReturn = (
        <View style={{ padding: 0, margin: 0, justifyContent: 'center', alignItems:'center'}}>
          <Image source = {require('../images/error.png')} style={{ width: 100, height: 100, marginBottom: 10  }} />
          <Text style={{ marginBottom: 10, textAlign: 'center' }}>Oops. Your attendance is not taken.{'\n'}Please stay in the class longer next time.</Text>
          <Button
            onPress={() => this.dismissAttendanceModal()}
            containerStyle={{alignSelf: 'center'}}
            buttonStyle={{ backgroundColor:'#007AFF', height: 50, width: 180, borderRadius: 20 }}
            title='Dismiss'
          />
        </View>
      )
    }

    return textReturn;
  }

  render() {
    return (

      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.props.loading}
          onRefresh={this.refresh.bind(this)}
        />
      }
      style={{ flex: 1 }}
      >

      <LinearGradient start={{x: 0, y: 1}} end={{x: 0, y: 0}} colors={['#7dbcff', '#0000ff']} style={styles.linearContainer} >
      </LinearGradient>

      <View style={{ alignItems: 'center', paddingBottom: 10}}>

        <Card containerStyle={styles.dateContainer}>
          <Text style={styles.smallDateFont}>
            {moment(new Date()).format("MMMM D, YYYY")}
          </Text>
          <Text style={styles.bigDateFont}>
            {moment(new Date()).format("dddd")}
          </Text>
        </Card>

        <Card containerStyle={styles.userContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.smallFont, {fontFamily: 'Helvetica Neu Bold'}]}>
              Profilettt
            </Text>
            <Text style={[styles.smallFont, {fontFamily: 'Helvetica Neu Bold'}]}>
              <Text style ={{ fontSize: 8 }}>ID</Text> {this.props.studID}
            </Text>
          </View>
          <Divider style={{marginTop: 5, marginBottom: 5 }}/>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={styles.centerContainer}>
              <Image source = {require('../images/user.png')} style={styles.userImage} />
            </View>
            <View>
            <Text style={styles.nameFont}>
              {this.props.name}
            </Text>
            <Text style={styles.smallFont}>
              {this.props.course}
            </Text>
            </View>
          </View>
        </Card>

        <Card containerStyle={styles.classContainer}>
            {this.renderAttendanceStatus()}
        </Card>

        <Modal
          isVisible={this.props.isAttendanceModalVisible}
          backdropOpacity={0.5}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={styles.attModalContainer} >
              {this.toggleAttendanceModal()}
          </View>
        </Modal>

        <Modal
          isVisible={this.props.isBluetoothModalVisible}
          backdropOpacity={0.5}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
            <View style={styles.bluetoothContainer} >
                  <Image source = {require('../images/bluetoothError.png')} style={styles.bluetoothImage} />
                  <Text alignSelf='center' style={{ marginBottom: 30 }}>Please turn on your Bluetooth.</Text>
                  <Button
                    onPress={this.dismissBluetoothModal.bind(this)}
                    containerStyle={{alignSelf: 'center'}}
                    buttonStyle={styles.tryAgainButton}
                    title='Try Again'
                  />
            </View>
        </Modal>

      </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  dateContainer: {
    ...Container.dateContainer
  },
  classContainer: {
    ...Container.classContainer
  },
  innerClassContainer: {
    ...Container.innerClassContainer
  },
  bluetoothContainer:{
    ...Container.bluetoothContainer
  },
  userContainer: {
    ...Container.userContainer
  },
  imageContainer: {
    ...Container.imageContainer
  },
  classInfoContainer: {
    ...Container.classInfoContainer
  },
  calendarErrorContainer:{
    ...Container.calendarErrorContainer
  },
  linearContainer: {
    ...Container.linearContainer
  },
  attModalContainer: {
    ...Container.attModalContainer
  },
  centerContainer: {
    ...Container.centerContainer
  },
  classImage:{
    ...Picture.classImage
  },
  userImage: {
    ...Picture.userImage
  },
  startingImage: {
    ...Picture.startingImage
  },
  calendarErrorImage: {
    ...Picture.calendarErrorImage
  },
  bluetoothImage: {
    ...Picture.bluetoothImage
  },
  classIndicator: {
    ...Indicator.classIndicator
  },
  smallFont: {
    ...Font.smallFont
  },
  bigFont: {
    ...Font.bigFont
  },
  noClassFont: {
    ...Font.noClassFont
  },
  smallDateFont: {
    ...Font.smallDateFont
  },
  bigDateFont: {
    ...Font.bigDateFont
  },
  nameFont: {
    ...Font.nameFont
  },
  attButton:{
    ...ButtonStyle.attButton
  },
  tryAgainButton: {
    ...ButtonStyle.tryAgainButton
  }
});

const mapStateToProps = ({ att }) => {
  const {
    name,
    studID,
    course,
    className,
    startTime,
    status,
    endTime,
    loading,
    room,
    time,
    inClass,
    attendanceTaken,
    checking,
    location,
    attendance,
    courseCode,
    isAttendanceModalVisible,
    isBluetoothModalVisible
  } = att;

  return {
    name,
    studID,
    course,
    status,
    className,
    startTime,
    endTime,
    loading,
    room,
    time,
    inClass,
    attendanceTaken,
    checking,
    location,
    attendance,
    courseCode,
    isAttendanceModalVisible,
    isBluetoothModalVisible
  };
}

export default connect(mapStateToProps, { getUserInfo, getNextClass, getAttTime, dismissAttendanceModal, dismissBluetoothModal, toggleBluetoothModal })(HomeScreen);
