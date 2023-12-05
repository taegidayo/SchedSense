import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import MapView, {
  Marker,
  AIzaSyBdgOMLn0SaaqPNKjMbzGWZ2BdXJdfREJQ,
  Polyline,
} from "react-native-maps";
import * as Location from "expo-location";
import { router, useGlobalSearchParams } from "expo-router";
import { marker1, marker2 } from "../../assets";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

const Maps = ({}) => {
  const glob = useGlobalSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.5665, // 초기 지도 중심 위도
    longitude: 126.978, // 초기 지도 중심 경도
    latitudeDelta: 0.0922, // 지도의 세로 범위
    longitudeDelta: 0.0421, // 지도의 가로 범위
  });

  const [currentLocation, setCurrentLocation] = useState(null);

  const handleArriveDateChange = (selectedDate) => {
    setArriveDate(selectedDate);
    setArriveDatePicker(false);
  };

  const handleArriveTimeChange = (selectedTime) => {
    setArriveTime(selectedTime);
    setArriveTimePicker(false);
  };

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

  // 버튼을 눌렀을 때 Alert를 띄워 사용자가 입력한 내용이 맞는 지 재확인하는 함수
  const showConfirmDialog = async () => {
    return Alert.alert(
      "확인", // 대화상자의 제목
      `출발지: \n입니다.등록하시겠습니까?`, // 대화상자의 내용
      [
        // 버튼 배열
        {
          text: "예",
          onPress: () => router.replace("./"),
        },
        {
          text: "아니오",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
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
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="출발지"
              style={{
                width: 40,
                height: 100,
              }}
            ></Marker>
          )}
        </MapView>
      ) : null}
    </View>
  );
};

export default Maps;
