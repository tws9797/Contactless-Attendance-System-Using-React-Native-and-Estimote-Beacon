import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Card, ListItem, Button, Input } from 'react-native-elements';
import { getUserInfo, getDate, getNextClass } from '../actions';
import { connect } from 'react-redux';
import firebase from 'firebase';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';

class HomeScreen extends Component {

  static navigationOptions = {
    header: null
  }

  componentDidMount(){
    this.props.getDate();
    this.props.getUserInfo();
    this.props.getNextClass();
  }

  componentDidUpdate(){
    var diff = 0;
    if(this.props.status != null){

      switch(this.props.status){
        case 1:
          diff = moment.duration(moment(this.props.endTime, "HH:mm:ss").diff(moment(moment(), "HH:mm:ss")));
          break;
        case 2:
          diff = moment.duration(moment(this.props.startTime, "HH:mm:ss").diff(moment(moment(), "HH:mm:ss")));
          break;
        case 3:
          diff = moment.duration(moment(0), "HH:mm:ss").diff(moment(moment(), "HH:mm:ss"));
          break;
      }

      BackgroundTimer.runBackgroundTimer(() => {
        this.props.getUserInfo();
        this.props.getNextClass();
      }, diff._milliseconds);

    }
  }


  renderStatus(){
    if(this.props.status != null){
      var textRendered = "";
      if(this.props.status == 1){
        textRendered = "Your Current Class"
      }
      else if(this.props.status == 2){
        textRendered += "Your Next Class"
      }
      else if(this.props.status == 0){
        textRendered += "You have no class already";
      }

      textRendered = (
        <View>
          <Text>{this.props.name}</Text>
          <Text>{this.props.studID}</Text>
          <Text>{textRendered}</Text>
          <Text>{this.props.className}</Text>
          <Text>{this.props.startTime} - {this.props.endTime}</Text>
        </View>
      )

      return textRendered;
    }
    else{
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
  }

  render() {
    return (
      <View>
      <Card title="Attendance">
        <Text style={{ fontSize: 36 }}>{this.props.date}</Text>
        {this.renderStatus()}
        <Button
          title='CHECK ATTENDANCE'
        />
      </Card>
      </View>
    );
  }

}

const mapStateToProps = ({ att }) => {
  const { date, name, studID, className, startTime, endTime, status, loading } = att;

  return { date, name, studID, className, startTime, endTime, status, loading };
}


export default connect(mapStateToProps, { getUserInfo, getDate, getNextClass })(HomeScreen);
