import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPosterPoolForScreen, pickPosterForIndex } from "../../../core/posterResolver.generated";

export default function ArtMainLux() {

  const __mbwPosterPool = getPosterPoolForScreen("app/screens/finalux/ArtMainLux.js", "ArtMainLux");
  const __mbwPickedPoster = pickPosterForIndex(__mbwPosterPool, 0);

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ArtMainLux Screen</Text>
            <Image style={styles.poster} source={__mbwPickedPoster || require("../../assets/images/bg-wall.png")} />
            <Button title="Next" onPress={() => navigation.navigate('ArtMainLux')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    title: { fontSize: 28, color: '#FFD700', marginBottom: 20 },
    poster: { width: 360, height: 640, resizeMode: 'cover', marginBottom: 20 }
});
