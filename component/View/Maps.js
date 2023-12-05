import React, { useState, useEffect } from "react";
import { View, Dimensions, Alert } from "react-native";
import MapView, {
  Marker,
  AIzaSyBdgOMLn0SaaqPNKjMbzGWZ2BdXJdfREJQ,
} from "react-native-maps";
import * as Location from "expo-location";
import { router, useGlobalSearchParams } from "expo-router";
import { marker1, marker2 } from "../../assets";
import { getScheduleDataByUseLocation } from "../../db";

const Maps = ({ onMarkerClick }) => {
  const glob = useGlobalSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.5665, // 초기 지도 중심 위도
    longitude: 126.978, // 초기 지도 중심 경도
    latitudeDelta: 0.0922, // 지도의 세로 범위
    longitudeDelta: 0.0421, // 지도의 가로 범위
  });

  const [currentLocation, setCurrentLocation] = useState(null);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 현재 위치를 가져오는 비동기 함수
    const getLocationAsync = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("위치 권한이 허용되지 않았습니다.");
          return;
        }

        // 현재 위치를 가져옴
        Location.watchPositionAsync({}, (location) => {
          setCurrentLocation(location.coords);
          setInitialRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setIsLoaded(true);
        });
      } catch (error) {
        console.error("현재 위치를 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    getLocationAsync();
    loadScheduleData();
  }, []);

  // 도착지의 좌표로 이루어진 값에 대해 주소로 변환해주는 함수, TMap api활용함. longitude와 latitude를 입력하면 됨
  const getAddress = async (lon, lat) => {
    var address = "";
    await fetch(
      `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&coordType=WGS84GEO&addressType=A10&lon=${lon}&lat=${lat}`,
      {
        method: "GET",
        headers: { appKey: "LBrn9I4s486CxR5grKWIt5831zAPlhq3S65zHyW1" },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        address = json.addressInfo.fullAddress.split(",")[2];
      });

    return address;
  };

  const loadScheduleData = async () => {
    var data = await getScheduleDataByUseLocation();
    setEvents(data);
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? (
        <MapView
          provider={AIzaSyBdgOMLn0SaaqPNKjMbzGWZ2BdXJdfREJQ} // 구글 맵스를 사용하기 위한 설정
          style={{
            width: Dimensions.get("window").width, // 전체 화면 너비
            height: Dimensions.get("window").height * 0.4, // 화면의 60%를 차지하도록 설정
          }}
          initialRegion={initialRegion}
          onPress={(event) => {}}
        >
          {events.map((event, index) => {
            return (
              <Marker
                coordinate={{
                  latitude: event.arriveLat,
                  longitude: event.arriveLong,
                }}
                title={event.text}
                key={index}
                onPress={() => {
                  onMarkerClick(event);
                }}
              />
            );
          })}
        </MapView>
      ) : null}
    </View>
  );
};

export { Maps };
