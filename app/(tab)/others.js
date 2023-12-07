import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { getWeatherByPoint, getLocation } from "../../utils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { checkWeatherData, selectWeatherData } from "../../db";
import { Maps, WeatherListView, RenderItem } from "../../component";
import { useSegments } from "expo-router";
const Test = () => {
  const [point, setPoint] = useState({});
  const [weather, setWeather] = useState([]);
  const [address, setAddress] = useState({});
  const [location, setLocation] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [event, setEvent] = useState();
  const [isEventLoaded, setIsEventLoaded] = useState(false);
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
  const loadWeather = async () => {
    if (Object.keys(location).length !== 0) {
      getWeatherByPoint(location.X, location.Y);

      setWeather(await selectWeatherData());
      setIsLoaded(true);
    }
  };

  async function getLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need location permissions to make this work!");
      return;
    }

    // 권한이 허용되면 추가적인 위치 관련 작업 수행
  }

  useEffect(() => {
    setTimeout(() => {
      // getLocationPermission();
      getCurrentLocation();
    }, 1000);
    // getCurrentLocation();
  }, []);
  useEffect(() => {
    funSetLocation();
  }, [address]);
  useEffect(() => {
    loadWeather();
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
        <View>
          <WeatherListView weatherData={weather} />
          <View style={{ marginTop: 20 }} />
          <Maps
            onMarkerClick={(item) => {
              setEvent(item);
              setIsEventLoaded(true);
            }}
          />

          {isEventLoaded ? <RenderItem item={event} index={0} /> : null}
        </View>
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
