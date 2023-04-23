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
  sendTweet(base64: boolean): any {
    this.img = this.img?.replace('file://', '');
    if (this.hashtags !== '') {
      this.msg += ' ' + this.hashtags;
    }
    if (this.url !== '') {
      this.msg += ' ' + this.url;
    }
    return TwitterShare.SendTweet(this.msg, this.img || false, base64);
  }
  static convertUri(url: string): string {
    return asset(url).uri;
  }
  static async getAbsolutePath() {
    return await TwitterShare.GetAbsolutePath();
  }
  twitterControlAlert() {
    Alert.alert('Not found Twitter App', 'Please make a choice', [
      {
        text: 'Go to twitter.com',
        onPress: async () => {
          let hashtag = this.hashtags ? `&hashtags=${this.hashtags}` : '';
          let cleanHashtag = hashtag.replace(/#/g, '');
          let url = this.url ? `&url=${this.url}` : '';
          let lastURL = `https://twitter.com/intent/tweet?text=${
            this.msg + cleanHashtag + url
          }`;
          let isUrl = await Linking.canOpenURL(encodeURI(lastURL));

          if (isUrl) {
            Linking.openURL(lastURL);
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
