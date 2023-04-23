import * as React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import ReactNativeTwitterShare from 'react-native-twitter-share';
import * as ImagePicker from 'react-native-image-picker';
const includeExtra = true;
export default function App() {
  const [response, setResponse] = React.useState<any>(null);
  const [text, onChangeText] = React.useState<string>('');
  const [urlTwit, setUrl] = React.useState<string>('');
  const [hashtag, setHashtag] = React.useState<string>('');
  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);
  async function send(url: string) {
    //let base64 = await RN.fs.readFile("bundle-assets://space.jpg","base64")
    let t = new ReactNativeTwitterShare(
      text,
      //base64,
      url,
      urlTwit,
      hashtag
    );
    t.sendTweet(false) // for base64 uri, true
      .then((e) => {
        console.log(e);
        if (e) {
          console.log('success');
        }
      })
      .catch((e) => {
        console.log(e);
        t.twitterControlAlert();
      });
  }
  return (
    <View>
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Twit text"
        />
        <TextInput
          style={styles.input}
          onChangeText={setHashtag}
          value={hashtag}
          placeholder="Twit hashtag"
        />
        <TextInput
          style={styles.input}
          onChangeText={setUrl}
          value={urlTwit}
          placeholder="Twit url"
        />
        {actions.map(({ title, type, options }) => {
          return (
            <TouchableOpacity
              style={styles.button}
              onPress={() => onButtonPress(type, options)}
            >
              <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {response?.assets &&
        response?.assets.map(({ uri }: { uri: string }) => (
          <>
            <View key={uri} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{ uri: uri }}
              />
            </View>
          </>
        ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => send(response.assets[0].uri)}
        >
          <Text style={styles.text}>Send</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    width: '90%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    width: 150,
    borderWidth: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'blue',
  },
  text: {
    color: 'blue',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
];

if (Platform.OS === 'ios') {
  actions.push({
    title: 'Take Image or Video\n(mixed)',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'mixed',
      includeExtra,
      presentationStyle: 'fullScreen',
    },
  });
}
