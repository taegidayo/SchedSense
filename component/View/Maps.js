import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import MapView, {
  Marker,
  AIzaSyBdgOMLn0SaaqPNKjMbzGWZ2BdXJdfREJQ,
} from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

const Maps = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.5665, // 초기 지도 중심 위도
    longitude: 126.978, // 초기 지도 중심 경도
    latitudeDelta: 0.0922, // 지도의 세로 범위
    longitudeDelta: 0.0421, // 지도의 가로 범위
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState({});
  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    // 현재 위치를 가져오는 비동기 함수
    const getLocationAsync = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("위치 권한이 허용되지 않았습니다.");
          return;
        }

        Location.watchPositionAsync({}, (location) => {
          setCurrentLocation(location.coords);
          setInitialRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarkerLocation(location.coords);
          setIsLoaded(true);
        });
      } catch (error) {
        console.error("현재 위치를 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    getLocationAsync();
  }, []);

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
        console.log(json, 123);
        address = json.addressInfo.fullAddress.split(",")[2];
      });

    console.log(address);
    return address;
  };

  const showConfirmDialog = async () => {
    var address = await getAddress(
      markerLocation.longitude,
      markerLocation.latitude
    );
    console.log(`${address}`);

    return Alert.alert(
      "확인", // 대화상자의 제목
      `선택된 주소는 \n${address.split(",")} 입니다.\n등록하시겠습니까?`, // 대화상자의 내용
      [
        // 버튼 배열
        {
          text: "아니오",
          onPress: () => console.log("아니오 선택됨"),
          style: "cancel",
        },
        {
          text: "예",
          onPress: () =>
            router.replace(
              `/AddScreen?address=${address}&lat=${markerLocation.latitude}&long=${markerLocation.longitude}`
            ),
        },
      ]
    );
  };

  useEffect(() => {
    console.log("1");
    if (isAgree) {
      router.push("/AddScreen");
    }
  }, [isAgree]);
  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? (
        <MapView
          provider={AIzaSyBdgOMLn0SaaqPNKjMbzGWZ2BdXJdfREJQ} // 구글 맵스를 사용하기 위한 설정
          style={{
            width: Dimensions.get("window").width, // 전체 화면 너비
            height: Dimensions.get("window").height * 0.6, // 화면의 60%를 차지하도록 설정
          }}
          initialRegion={initialRegion}
          onPress={(event) => {
            setMarkerLocation(event.nativeEvent.coordinate);
          }}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
              title="내 위치"
              description="현재 위치"
            />
          )}
        </MapView>
      ) : (
        <View></View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "blue", // 버튼 배경색 설정
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          margin: 10,
          borderRadius: 5,
        }}
        onPress={() => {
          // 여기에 버튼을 눌렀을 때의 동작을 추가합니다.
          console.log(`${markerLocation.latitude}`);
          getAddress(markerLocation.longitude, markerLocation.latitude);
          showConfirmDialog();
        }}
      >
        <Text style={{ color: "white" }}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Maps;
