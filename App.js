/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import _ from 'lodash'
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CirclePacking from './src/CirclePacking'
import CirclePackingInRect from './src/CirclePackingInRect'


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <CirclePackingInRect
          style={{flex: 1, width: 357, height: 323}}
          distanceFromPath={10}
          keywords={['Cool', 'Peaceful', 'Excited', 'Calm', 'Happy', 'Lovely', 'Beautiful', 'Kindness']}
          temperature={4}
        />      
        <CirclePacking 
          style={{flex: 1, width: 357, height: 323}}
          distanceFromPath={10}
          keywords={_.take(['Cool', 'Peaceful', 'Excited', 'Calm', 'Happy', 'Lovely', 'Beautiful', 'Kindness'], Math.floor(Math.random()* 2) + 3)}
          temperature={10}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
