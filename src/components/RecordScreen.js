import React, { Component } from 'react';
import { Switch, ScrollView, RefreshControl, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Input, Image, Divider, Icon  } from 'react-native-elements';
import { getUserInfo, getUserClass } from '../actions';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Firebase from '../Firebase';
import LinearGradient from 'react-native-linear-gradient';
import { Font, Container, Picture } from '../styles';

class RecordScreen extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      collapsed: true,
    };
  }

  //Get user name and class
  componentDidMount(){
    this.props.getUserInfo();
    this.props.getUserClass();
  }

  //Refresh the application state
  refresh(){
    this.props.getUserClass();
  }


  //Action to expand the section
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  //Set each section
  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  //Render header of each record
  renderHeader = (section, _, isActive) => {
    return (
      <View
        style={[isActive ? {marginBottom: 0} : {marginBottom: 5} ]}
      >
      <Card containerStyle={[styles.sectionHeaderContainer, isActive ? {paddingBottom: 0} : {paddingBottom: 10}]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.sectionHeaderFont}>
            Class
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text style={styles.sectionHeaderFont}>
            <Text style ={{ fontSize: 8 }}>Code</Text> {section.course}
          </Text>
          <Image source = {require('../images/up.png')} style={[isActive ? { width: 15, height: 15, transform: [{ rotate: '180deg' }]} : { width: 15, height: 15, transform: [{ rotate: '0deg' }]}] } />
          </View>
        </View>
        <Divider style={{marginTop: 5, marginBottom: 5 }}/>{ !isActive ? (
            <View style={[styles.sectionInfoContainer, {flexDirection: 'row'}]}>
            <View style={styles.sectionImageContainer}>
              <Image source = {require('../images/record.png')} style={styles.recordImage} />
            </View>
            <View style={{ flex: 4 }}>
            <Text numberOfLines={1} style={[styles.courseDescFont, { fontSize: 14 }]}>
              {section.desc}
            </Text>
            <Text style={styles.smallFont}>
              Software Engineering
            </Text>
          </View>
        </View>): <View />
        }
      </Card>
      </View>
    );
  };

  //Render content of each record
  renderContent = (section, _, isActive) => {
    const { currentUser } = Firebase.auth();

    return (
      <View
        style={{marginBottom: 5, marginTop: 0, borderWidth: 0}}
      >
      <Card containerStyle={{  width: '80%',
        marginTop: 0,
        borderWidth: 0,
        alignSelf: 'center',
        shadowOpacity: 0.6,
        borderTopWidth: 0,
        shadowRadius: 20,
        elevation: 5}}>
        {Object.keys(section.attendance).sort((a, b) => {
          let date1 = new Date(a);
          let date2 = new Date(b);
          return (date1 > date2) ? 1 : -1;

        }).map(key => {
          return (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style = {{fontFamily: 'Arial', color: '#000000'}}>
                {key.substr(key.indexOf(' ')+1)}
              </Text>
                {section.attendance[key][currentUser.uid]['attendance'] ? <Icon size={12} color='green' name='check-circle' type='font-awesome' />: <Icon size={12} color='red' name='times-circle' type='font-awesome' />}
            </View>
          )
        })}
        </Card>
      </View>
    );
  }

  //Render each record
  renderRecords(){
    if(!this.props.recordLoading){
      if(this.props.records != null){
        return (<Accordion
          activeSections={this.state.activeSections}
          sections={this.props.records}
          touchableProps={{activeOpacity: 0.9}}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          onChange={this.setSections}
        />)
      }
    }
    else {
        return (
          <View style={styles.indicatorContainer}><ActivityIndicator size="small" color="#007AFF" /></View>
        )
    }
  }

  render() {
    return (
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.props.recordLoading}
          onRefresh={this.refresh.bind(this)}
        />
      }
      style={{ flex: 1 }}
      >
      <LinearGradient start={{x: 0, y: 1}} end={{x: 0, y: 0}} colors={['#7dbcff', '#0000ff']} style={{ width: '100%'}} >
        <Card containerStyle={styles.recordsHeaderContainer}>
          <Text style={[styles.recordsHeaderFont, {fontSize: 24, lineHeight: 30}]}>Hi <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>!</Text>
          <Text style={styles.recordsHeaderFont}>Here's your attendance records.</Text>
        </Card>
      </LinearGradient>
      <View style={{marginBottom: 20}}>
      {this.renderRecords()}
      </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  smallFont: {
    ...Font.smallFont
  },
  sectionHeaderFont: {
    ...Font.sectionHeaderFont
  },
  recordsHeaderFont:{
    ...Font.smallDateFont
  },
  courseDescFont:{
    ...Font.nameFont
  },
  contentContainer: {
    ...Container.userContainer
  },
  sectionHeaderContainer: {
    ...Container.sectionHeaderContainer
  },
  sectionInfoContainer: {
    ...Container.classInfoContainer
  },
  contentViewContainer: {
    ...Container.contentViewContainer
  },
  sectionImageContainer: {
    ...Container.centerContainer
  },
  indicatorContainer: {
    ...Container.indicatorContainer
  },
  recordsHeaderContainer:{
    ...Container.recordsHeaderContainer
  },
  recordImage: {
    ...Picture.userImage
  }
})

const mapStateToProps = ({ att, record }) => {
  const {
    name,
    course,
    records,
    recordLoading
  } = record;


  return {
    name,
    course,
    records,
    recordLoading,
  };
}

export default connect(mapStateToProps, { getUserInfo, getUserClass })(RecordScreen);
