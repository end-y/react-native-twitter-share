import * as React from 'react';

import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import ReactNativeTwitterShare from 'react-native-twitter-share';

export default function App() {
  function send() {
    let t = new ReactNativeTwitterShare(
      'Hello World',
      ReactNativeTwitterShare.convertUri(require('../images/space.jpg'))
    );
    t.sendTweet()
      .then((e) => {
        if (e) {
          console.log('success');
        }
      })
      .catch(() => {
        t.twitterControlAlert();
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={send}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
