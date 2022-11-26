import { Alert, Linking, NativeModules, Platform } from 'react-native';
const asset = require('react-native/Libraries/Image/resolveAssetSource');
const LINKING_ERROR =
  `The package 'react-native-twitter-share' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TwitterShare = NativeModules.TwitterShare
  ? NativeModules.TwitterShare
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default class ReactNativeTwitterShare {
  public msg: string;
  public img?: string;
  public url?: string;
  public hashtags?: string;
  constructor(msg: string, img?: string, url?: string, hashtags?: string) {
    this.msg = msg;
    this.img = img;
    this.url = url;
    this.hashtags = hashtags;
  }
  sendTweet(): Promise<boolean | Error> {
    return TwitterShare.SendTweet(this.msg, this.img || false);
  }
  static convertUri(url: string): string {
    return asset(url).uri;
  }
  twitterControlAlert() {
    Alert.alert('Not found Twitter App', 'Please make a choice', [
      {
        text: 'Go to twitter.com',
        onPress: async () => {
          let isUrl = await Linking.canOpenURL(
            `https://twitter.com/intent/tweet?text=${this.msg}&url=${
              this.url || null
            }&hashtags=${this.hashtags || null}`
          );
          if (isUrl) {
            Linking.openURL(
              `https://twitter.com/intent/tweet?text=${this.msg}&url=${
                this.url || null
              }&hashtags=${this.hashtags || null}`
            );
          }
        },
      },
      {
        text: 'Download on App Store',
        onPress: async () => {
          let isUrl = await Linking.canOpenURL(
            'market://details?id=com.twitter.android'
          );
          if (isUrl) {
            Linking.openURL('market://details?id=com.twitter.android');
          } else {
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.twitter.android'
            );
          }
        },
      },
    ]);
  }
}
