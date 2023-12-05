import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { calendarIcon } from "../../assets";
import { router } from "expo-router";

// 이벤트 수정을 위해 EditScreen으로 이동하는 함수
const editEvent = (selectedEvent) => {
  router.push(`/EditScreen?id=${selectedEvent.id}`);
};
// 이벤트 삭제 함수
const deleteEvent = (item) => {
  return Alert.alert(
    "알림", // 대화상자의 제목
    `${item.text}를 삭제하시겠습니까?.`, // 대화상자의 내용
    [
      {
        text: "예",
        onPress: async () => {
          await deleteScheduleDataByID(item.id);
          scheduleUpdate();
        },
      },
      {
        text: "아니오",
        onPress: () => {},
        style: "cancel",
      },
    ]
  );
};

// 이벤트를 렌더링하기 위한 renderItem 함수
const renderItem = ({ item, index }) => (
  <TouchableOpacity
    onPress={() => editEvent(item)}
    onLongPress={() => deleteEvent(item)}
  >
    <View style={styles.eventItem}>
      <Image
        source={calendarIcon}
        style={{ ...styles.icon, opacity: index === 0 ? 1 : 0 }}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventText}>{item.text}</Text>

        <View>
          <Text style={styles.eventTime}>
            {item.startDate}~{item.endDate}
          </Text>
          {!item.allDay ? (
            <Text style={styles.eventTime}>
              {item.startTime} - {item.endTime}
            </Text>
          ) : (
            <Text style={styles.eventTime}>종일</Text>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    opacity: 0, // 아이콘이 없는 항목에서는 투명하게 설정
  },
  eventItem: {
    backgroundColor: "white",
    flexDirection: "row", // 아이콘과 텍스트를 가로로 배치
    alignItems: "center", // 세로 중앙 정렬
    left: -20,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    // 추가 스타일링 필요 시 여기에 추가
  },
  eventText: {
    fontSize: 16,
    // 텍스트 스타일링 필요 시 여기에 추가
  },
});

export { renderItem };
