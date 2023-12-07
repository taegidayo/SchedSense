import * as Notifications from "expo-notifications";
import { Stack, Tabs, router, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Text } from "react-native";
import * as Location from "expo-location";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getSecondsUntilTargetTime } from "../../utils";

export const unstable_settings = {
  initialRouteName: "index",
};

async function getLocationPermission() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access location was denied");
    return;
  }
}

const TASK_NAME = "BACKGROUND_TASK";

const define = () => {};

const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 15, // 최소 15분
      stopOnTerminate: false, // 앱이 종료되어도 계속 실행
      startOnBoot: true, // 재부팅 후에도 실행
    });
    console.log("백그라운드 작업 등록 성공");
  } catch (err) {
    console.log("백그라운드 작업 등록 실패:", err);
  }
};
// 알람 설정 함수
async function scheduleAlarm() {
  console.log(getSecondsUntilTargetTime(21, 41));
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "알람!",
      body: "21시 40분입니다!",
      sticky: true, // 이 옵션을 true로 설정
    },
    trigger: {
      seconds: 10, // 위에서 계산한 초 단위 시간
    },
  });
}

const handleSignInWithGoogle = async () => {
  const user = await AsyncStorage.getItem("@user");
  if (!user) {
    if (response?.type === "success") {
      // 인증 요청에 대한 응답이 성공이면, 토큰을 이용하여 유저 정보를 가져옴.
      await getUserInfo(response.authentication?.accessToken);
    }
  } else {
    // 유저 정보가 이미 있으면, 유저 정보를 가져옴.
    userInfo = JSON.parse(user);
  }
};

const Layout = () => {
  if (Platform.OS == "android") {
  }
  //   const [fontLoaded] = useFonts({
  // DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
  // DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
  // DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  //   });
  //   if (!fontLoaded) {
  // return null;
  //   }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "홈",
          headerTitle: "메인",
          headerRight: () => {},
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="others"
        options={{
          headerTitle: "기타정보",
          tabBarLabel: "기타",
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default Layout;
