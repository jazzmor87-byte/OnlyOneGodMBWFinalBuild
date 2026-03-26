import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getPosterPoolForScreen, pickPosterForIndex } from "../../../core/posterResolver.generated";


const __mbwEngineRouteBits = (raw = {}) => {

  const __mbwRouteBits = __mbwEngineRouteBits(__mbwProps);
  const __mbwScreenPath = __mbwRouteBits.screenPath;
  const __mbwScreenStem = __mbwRouteBits.screenStem;
  const __mbwPosterIndex = __mbwRouteBits.posterIndex;
  const __mbwPosterPool = getPosterPoolForScreen(__mbwScreenPath, __mbwScreenStem);
  const __mbwPickedPoster = pickPosterForIndex(__mbwPosterPool, __mbwPosterIndex);


  const props = raw || {};
  const route = props.route || {};
  const params = route.params || {};
  const screenPath = props.screenPath || params.screenPath || params.__screenPath || "";
  const screenStem = props.screenStem || params.screenStem || params.__screenStem || route.name || "";
  const posterIndex =
    Number.isInteger(props.posterIndex) ? props.posterIndex :
    Number.isInteger(params.posterIndex) ? params.posterIndex :
    0;
  return { screenPath, screenStem, posterIndex };
};


export default function _PosterEngine(__mbwProps) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>_PosterEngine Screen</Text>
            <Image style={styles.poster} source={__mbwPickedPoster || require("../../assets/images/bg-wall.png")} />
            <Button title="Next" onPress={() => navigation.navigate('_PosterEngine')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    title: { fontSize: 28, color: '#FFD700', marginBottom: 20 },
    poster: { width: 360, height: 640, resizeMode: 'cover', marginBottom: 20 }
});
