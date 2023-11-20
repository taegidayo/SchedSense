import { Platform, Text, View } from "react-native";
import { getWeatherByPoint, getLocation } from "../../function";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
const Test = () => {
  const [point, setPoint] = useState({});
  const [weather, setWeather] = useState({});
  const [address, setAddress] = useState({});
  const [location, setLocation] = useState({});

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
    if (Object.keys(address).length !== 0) {
      getWeatherByPoint(location.X, location.Y);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
  useEffect(() => {
    funSetLocation();

    // a();
  }, [address]);

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

  useEffect(() => {
    if (Object.keys(weather).length !== 0) {
    }
  }, [weather]);

  return (
    <View>
      <Text>asd {location.X}</Text>
    </View>
  );
};
export default Test;
