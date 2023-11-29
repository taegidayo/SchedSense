import * as Notifications from "expo-notifications";
import { Stack, Tabs, router } from "expo-router";
import { Platform } from "react-native";
import * as Location from "expo-location";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getSecondsUntilTargetTime } from "../utils";

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

var userInfo = null;
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
// Google 로그인 처리하는 함수

const Layout = () => {
  // scheduleAlarm();

  // TaskManager.defineTask(TASK_NAME, () => {
  //   try {
  //     // 여기에 실행할 코드

  //     console.log("백그라운드 작업 실행");
  //     return BackgroundFetch.Result.NewData;
  //   } catch (err) {
  //     return BackgroundFetch.Result.Failed;
  //   }
  // });
  // registerBackgroundTask();
  getLocationPermission();

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
    <Stack initialRouteName="home">
      <Stack.Screen
        name="AddScreen"
        options={{
          presentation: "modal",
          headerShown: true,
        }}
      />

      <Stack.Screen name="EditScreen" options={{ title: "경기계획" }} />
      <Stack.Screen
        name="(tab)"
        options={{
          presentation: "modal",
          headerTitle: "Modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
