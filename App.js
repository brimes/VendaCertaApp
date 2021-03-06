import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

// Scenes
import HomeScene from './src/scenes/HomeScene'
import MySalesScene from './src/scenes/MySalesScene'

global.testModeActivated = false

const uiTheme = {
    palette: {
      primaryColor: '#6ccbd7',
      accentColor: '#71bf44',
    },
    buttonRaised: {
      container: {
        backgroundColor: '#6ccbd7',
      },
      text: {
        color: '#FFFFFF'
      }
    },
    toolbar: {
        container: {
            height: 10,
        },
    },
};

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
          <Router navigationBarStyle={styles.transparentNavBar} backTitle="voltar">
              <Scene key="user" hideNavBar={false} >
                  <Scene key="home" component={HomeScene}/>
                  <Scene key="mySales" component={MySalesScene}/>
              </Scene>
          </Router>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentNavBar: {
    backgroundColor: 'transparent',
    height: 40,
    borderBottomWidth: 0,
    borderColor: '#FFFFFF',
  },

});
