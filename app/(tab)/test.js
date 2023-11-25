import {
  Platform,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { getWeatherByPoint, getLocation } from "../../utils";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { selectWeatherData } from "../../db";
import { WeatherListView } from "../../component";
const Test = () => {
  const [point, setPoint] = useState({});
  const [weather, setWeather] = useState([]);
  const [address, setAddress] = useState({});
  const [location, setLocation] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  getCurrentLocation = async () => {
    var { coords } = await Location.getCurrentPositionAsync();

    setPoint({ lat: coords.latitude, long: coords.longitude });

    setAddress(
      await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
    );
  };
  const a = async () => {
    if (Object.keys(location).length !== 0) {
      // var data = await selectWeatherData();
      // console.log(data[0]);
      setWeather(await selectWeatherData());
      setIsLoaded(true);
      // console.log(weather[0]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getCurrentLocation();
    }, 1000);
    // getCurrentLocation();
  }, []);
  useEffect(() => {
    funSetLocation();
  }, [address]);
  useEffect(() => {
    a();
  }, [location]);

  /**
   *
   *
   */
  const funSetLocation = async () => {
    if (Object.keys(address).length !== 0) {
      setLocation(
        await getLocation(
          address[0].region,
          address[0].city,
          address[0].street,
          point
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {isLoaded ? (
        <WeatherListView weatherData={weather} />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
export default Test;
