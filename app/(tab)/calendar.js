import { useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { MonthView, WeekView } from "../../component";

export default function App() {
  const [viewMode, setViewMode] = useState("month"); // 'month' 또는 'week'
  const translateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const dragDistance = event.nativeEvent.translationY;
      if (dragDistance < -100 && viewMode === "month") {
        // 위로 드래그
        setViewMode("week");
      } else if (dragDistance > 100 && viewMode === "week") {
        // 아래로 드래그
        setViewMode("month");
      }
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleDateClick = (selectedDate) => {
    console.log("선택된 날짜:", selectedDate);
    // 여기서 추가 작업 수행
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>asd</Text>
    </View>
  );
}
