import { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calender } from "../component";

export default function App() {
  const handleDateClick = (selectedDate) => {
    console.log("선택된 날짜:", selectedDate);
    // 여기서 추가 작업 수행
  };

  return (
    <View style={{ flex: 1 }}>
      <Calender onDateClick={handleDateClick} />
    </View>
  );
}
