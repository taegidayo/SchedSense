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
import { marker1, marker2 } from "../assets";
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

  const [selectedButton, setSelectedButton] = useState(false);
  const [startMarkerLocation, setStartMarkerLocation] = useState({});
  const [arriveMarkerLocation, setArriveMarkerLocation] = useState({});

  const [arriveDatePicker, setArriveDatePicker] = useState(false); //도착 예정일 선택기
  const [arriveTimePicker, setArriveTimePicker] = useState(false); // 도착 예정시간 선택기
  const [arriveDate, setArriveDate] = useState(new Date()); // 도착날짜 에 대한 State
  const [arriveTime, setArriveTime] = useState(new Date()); // 도착 시간에 대한 State
  const [routes, setRoutes] = useState([]); // 경로에 대한 State 출발지와 도착지 사이에서 경로조회를 했을 때 다음 경로에 대한 좌표가 변수로 들어가 있음.

  const [totalTime, setTotalTime] = useState(0); // 경로에 대한 이동시 전체소요시간

  const [isSelected, setIsSelected] = useState(false); // 출발지 혹은 도착지가 선택되었는 지, 만약 되지 않았을 경우 경로조회가 되지 않도록 하기위함
  const [isSearched, setIsSearched] = useState(false); // 경로를 조회 했는 지 여부, 조회되었을 경우에만 등록이 가능하게 함.

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
          setArriveMarkerLocation(location.coords);
          setStartMarkerLocation(location.coords);
          setIsLoaded(true);
        });
      } catch (error) {
        console.error("현재 위치를 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    getLocationAsync();
  }, []);

  // 도착지의 좌표로 이루어진 값에 대해 주소로 변환해주는 함수, TMap api활용함.
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

  /**
   * 현재 선택된 출발지와 도착지 사이의 경로를 api로 가져오는 코드.
   * 출발지의 coords와 도착지의 coords필요
   * @todo 도착지의 시간알고리즘 넣기(설정한 시간에 따라 경로를 조회하여,해당시간의 교통혼잡도를 반영하기 위함)
   *   예를 들면 오전 9시 30분에 도착 예정으로 했다-> 도착시간이 9시 30분이 되도록 api를 계속 호출해서 9시30분에 인접하게 맞춰줌.
   *   현재는 현재 시간을 기반으로 도착지의 시간을 읽어오는 상황
   *
   *
   */
  const getRoute = async () => {
    await fetch(
      `https://apis.openapi.sk.com/tmap/routes?version=1&format=json&callback=result&startX=${startMarkerLocation.longitude}&startY=${startMarkerLocation.latitude}&endX=${arriveMarkerLocation.longitude}&endY=${arriveMarkerLocation.latitude}`,
      {
        method: "GET",
        headers: { appKey: "LBrn9I4s486CxR5grKWIt5831zAPlhq3S65zHyW1" },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setRoutes([]);
        for (var i = 0; i < json.features.length; i++) {
          if (typeof json.features[i].properties.totalTime == "number") {
            setTotalTime(
              (json.features[i].properties.totalTime / 60).toFixed(0)
            );
            setIsSearched(true);
          }
          var route = [];
          if (Array.isArray(json.features[i].geometry.coordinates[0])) {
            for (
              var j = 0;
              j < json.features[i].geometry.coordinates.length;
              j++
            ) {
              route.push({
                longitude: json.features[i].geometry.coordinates[j][0],
                latitude: json.features[i].geometry.coordinates[j][1],
              });
            }
          } else {
            route.push({
              longitude: json.features[i].geometry.coordinates[0],
              latitude: json.features[i].geometry.coordinates[1],
            });
          }

          setRoutes((prev) => {
            return [...prev, ...route];
          });
        }
      });
  };

  // 버튼을 눌렀을 때 Alert를 띄워 사용자가 입력한 내용이 맞는 지 재확인하는 함수
  const showConfirmDialog = async () => {
    var startAddress = await getAddress(
      startMarkerLocation.longitude,
      startMarkerLocation.latitude
    );

    var address = await getAddress(
      arriveMarkerLocation.longitude,
      arriveMarkerLocation.latitude
    );

    return Alert.alert(
      "확인", // 대화상자의 제목
      `출발지: ${startAddress.split(",")}\n도착지: ${address.split(
        ","
      )}\n입니다.등록하시겠습니까?`, // 대화상자의 내용
      [
        // 버튼 배열
        {
          text: "예",
          onPress: () =>
            router.replace(
              `/${glob.Page}?startAddres=${startAddress}&startLat=${startMarkerLocation.latitude}&startLong=${startMarkerLocation.longitude}&arriveAddress=${address}&arriveLat=${arriveMarkerLocation.latitude}&arriveLong=${arriveMarkerLocation.longitude}&totalTime=${totalTime}`
            ),
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
          onPress={(event) => {
            if (selectedButton) {
              setStartMarkerLocation(event.nativeEvent.coordinate);
            } else {
              setArriveMarkerLocation(event.nativeEvent.coordinate);
            }
            setIsSelected(true);
            setIsSearched(false);
            setTotalTime(0);
          }}
        >
          <Polyline
            coordinates={routes}
            strokeColor="#00F" // 선의 색깔
            strokeWidth={3} // 선의 두께
          />
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: startMarkerLocation.latitude,
                longitude: startMarkerLocation.longitude,
              }}
              title="출발지"
              style={{
                width: 40,
                height: 100,
              }}
            >
              <View style={{ marginTop: 45 }}>
                <Text style={{ width: 40, height: 17 }}>출발지</Text>
                <Image source={marker1} style={{ width: 40, height: 40 }} />
              </View>
            </Marker>
          )}

          {currentLocation && (
            <Marker
              coordinate={{
                latitude: arriveMarkerLocation.latitude,
                longitude: arriveMarkerLocation.longitude,
              }}
              title="도착지"
              style={{
                width: 40,
              }}
            >
              <View style={{ marginTop: 30 }}>
                <Text style={{ width: 40, height: 17 }}>도착지</Text>
                <Image source={marker2} style={{ width: 40, height: 40 }} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : null}

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          height: 40,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: selectedButton ? "blue" : "#00AAAA", // 버튼 배경색 설정
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            height: 40,
            borderRadius: 5,
          }}
          onPress={() => {
            setSelectedButton(true);
          }}
        >
          <Text style={{ color: "white" }}>출발지 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: !selectedButton ? "blue" : "#00AAAA", // 버튼 배경색 설정
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            height: 40,
            borderRadius: 5,
          }}
          onPress={() => {
            setSelectedButton(false);
          }}
        >
          <Text style={{ color: "white" }}>도착지 선택</Text>
        </TouchableOpacity>
      </View>

      {/* 언제 도착할지 예정을 적어두는 곳 */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          height: 50,
          alignItems: "center",
        }}
      >
        <Text>도착 예정 시간: </Text>
        {/* 도착예정일자 지정버튼 */}
        <TouchableOpacity style={{}} onPress={() => setArriveDatePicker(true)}>
          <Text style={{}}>
            {arriveDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </Text>
        </TouchableOpacity>

        {/* 도착예정시간 지정버튼 */}

        <TouchableOpacity style={{}} onPress={() => setArriveTimePicker(true)}>
          <Text style={{}}>
            {arriveTime.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>

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
          if (isSelected) {
            getRoute();
          } else {
            return Alert.alert(
              "안내", // 대화상자의 제목
              `출발지와 도착지를 선택해야합니다.`, // 대화상자의 내용
              [
                // 버튼 배열
                {
                  text: "확인",
                  onPress: () => {},
                  style: "cancel",
                },
              ]
            );
          }
        }}
      >
        <Text style={{ color: "white" }}>경로조회</Text>
      </TouchableOpacity>

      <Text>예상소요시간 : {totalTime}분</Text>

      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          margin: 10,
          borderRadius: 5,
        }}
        onPress={() => {
          if (isSearched) {
            getAddress(
              arriveMarkerLocation.longitude,
              arriveMarkerLocation.latitude
            );
            showConfirmDialog();
          } else {
            Alert.alert(
              "확인", // 대화상자의 제목
              `경로조회가 되어야 등록할 수 있습니다.`, // 대화상자의 내용
              [
                // 버튼 배열
                {
                  text: "아니오",
                  onPress: () => {},
                  style: "cancel",
                },
              ]
            );
          }
        }}
      >
        <Text style={{ color: "white" }}>등록</Text>
      </TouchableOpacity>

      {/* 날짜 선택기 모달 */}
      <DateTimePickerModal
        isVisible={arriveDatePicker}
        mode="date"
        onConfirm={handleArriveDateChange}
        onCancel={() => setArriveDatePicker(false)}
      />
      {/* 시간 선택기 모달 */}
      <DateTimePickerModal
        isVisible={arriveTimePicker}
        mode="time"
        onConfirm={handleArriveTimeChange}
        onCancel={() => setArriveTimePicker(false)}
      />
    </View>
  );
};

export default Maps;
