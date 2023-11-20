import * as Notifications from "expo-notifications";
import { Stack, Tabs, router } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

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

const useNotificationObserver = async () => {
  // useEffect(async () => {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("알림 권한이 거부되었습니다!");
  //     return;
  //   }
  //   const token = (await Notifications.getExpoPushTokenAsync()).data;
  //   let isMounted = true;
  //   function redirect(notification) {
  //     const url = notification.request.content.data?.url;
  //     if (url) {
  //       router.push(url);
  //     }
  //   }
  //   Notifications.getLastNotificationResponseAsync().then((response) => {
  //     if (!isMounted || !response?.notification) {
  //       return;
  //     }
  //     redirect(response?.notification);
  //   });
  //   const subscription = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       redirect(response.notification);
  //     }
  //   );
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "You've got mail! 📬",
  //       body: "Here is the notification body",
  //       data: { data: "goes here" },
  //     },
  //     trigger: { seconds: 2 },
  //   });
  //   return () => {
  //     isMounted = false;
  //     subscription.remove();
  //   };
  // }, []);
};

const Layout = () => {
  getLocationPermission();

  if (Platform.OS == "android") {
    useNotificationObserver();
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
      <Tabs.Screen name="index" options={{}}></Tabs.Screen>
      <Tabs.Screen name="calendar"></Tabs.Screen>
      <Tabs.Screen name="test"></Tabs.Screen>
    </Tabs>

    // <Stack initialRouteName="home">
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       presentation: "modal",
    //       headerShown: true,
    //     }}
    //   />

    //   <Stack.Screen name="calendar" options={{ title: "경기계획" }} />
    // </Stack>
  );
};

export default Layout;
