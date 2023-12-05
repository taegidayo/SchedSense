import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-web";
import { calendarIcon } from "../../assets";

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

export { renderItem };
