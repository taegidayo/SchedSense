import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useGlobalSearchParams, useSegments } from "expo-router";
import { getScheduleDataByID } from "../db";

const EditScreen = () => {
  const param = useGlobalSearchParams();
  // const { event, updateEvent, deleteEvent } = param;

  const [event, setEvent] = useState({
    text: "asd",
    allDay: true,
    startDate: "2023-11-29",
    endDate: "2023-11-29",
  });
  const segments = useSegments();

  const [eventText, setEventText] = useState(event.text);
  const [isAllDay, setIsAllDay] = useState(event.allDay);

  // 날짜 및 시간 상태
  const [startDate, setStartDate] = useState(new Date(event.startDate));
  const [endDate, setEndDate] = useState(new Date(event.endDate));
  const [startTime, setStartTime] = useState(
    event.startTime ? event.startTime : null
  );
  const [endTime, setEndTime] = useState(event.endTime ? event.endTime : null);

  // 날짜 및 시간 선택기 표시 상태
  const [isStartDatePicker, setStartDatePicker] = useState(false);
  const [isEndDatePicker, setEndDatePicker] = useState(false);
  const [isStartTimePicker, setStartTimePicker] = useState(false);
  const [isEndTimePicker, setEndTimePicker] = useState(false);

  const getData = async () => {
    const data = await getScheduleDataByID(param.id);
    console.log(data[0]);

    console.log(data[0].endTime);
    setEvent(data[0]);
    setEventText(data[0].text);
    setIsAllDay(data[0].setIsAllDay);
    setStartDate(new Date(data[0].startDate));
    setEndDate(new Date(data[0].endDate));
    setStartTime(data[0].startTime ? data[0].startTime : new Date());
    setEndTime(data[0].endTime ? data[0].endTime : new Date());
  };
  useEffect(() => {
    getData();
  }, [segments]);

  const toggleSwitch = () => setIsAllDay((previousState) => !previousState);

  // 날짜 및 시간 변경 핸들러
  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setStartDatePicker(false);
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate);
    setEndDatePicker(false);
  };

  const handleStartTimeChange = (selectedTime) => {
    setStartTime(selectedTime);
    setStartTimePicker(false);
  };

  const handleEndTimeChange = (selectedTime) => {
    setEndTime(selectedTime);
    setEndTimePicker(false);
  };

  // 사용자가 저장 버튼을 누르는 등의 저장 동작을 수행하는 함수
  const handleSave = () => {
    // 현지 시간대를 고려하여 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
    const formatDate = (date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split("T")[0];
    };

    console.log("수정 전 이벤트:", event);
    // 하루 종일 이벤트인 경우 시간을 무시하고 날짜만 사용
    const finalStartDate = formatDate(startDate);
    const finalEndDate = formatDate(endDate);

    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    // 하루 종일 이벤트가 아닌 경우에만 시간 설정
    const finalStartTime = isAllDay ? null : startTime;
    const finalEndTime = isAllDay ? null : endTime;

    const updateEvent = {
      text: eventText,
      startDate: finalStartDate,
      startTime: finalStartTime,
      endDate: finalEndDate,
      endTime: finalEndTime,
      isAllDay: isAllDay,
    };

    // 이벤트 추가
    // if (route.params && route.params.addScreen) {
    //   route.params.addScreen(updateEvent);
    // }
    console.log("수정 후 이벤트:", event);

    router.back();
  };

  const handleDelete = () => {
    Alert.alert("삭제하기", "삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "네",
        onPress: () => {
          deleteEvent(event);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TextInput
          value={eventText}
          onChangeText={setEventText}
          style={styles.input}
        />
      </View>

      {/* 하루 종일' 스위치 섹션 */}
      <View style={styles.section}>
        <Text style={styles.label}>하루 종일</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAllDay ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isAllDay}
        />
      </View>

      {/* 날짜와 시간을 선택하는 섹션 */}
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateAndTime}>
          {/* 시작 날짜 선택 버튼 */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setStartDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {startDate.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </Text>
          </TouchableOpacity>

          {/* 시작 시간 선택 버튼 */}
          {!isAllDay && (
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setStartTimePicker(true)}
            >
              <Text style={styles.timeText}>{startTime}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.arrow}>→</Text>

        {/* 끝 날짜와 시간 */}
        <View style={styles.dateAndTime}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setEndDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {endDate.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </Text>
          </TouchableOpacity>

          {/* 끝 시간 선택 버튼 */}
          {!isAllDay && (
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setEndTimePicker(true)}
            >
              <Text style={styles.timeText}>{endTime}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 시작 날짜 선택기 모달 */}
      <DateTimePickerModal
        isVisible={isStartDatePicker}
        mode="date"
        onConfirm={handleStartDateChange}
        onCancel={() => setStartDatePicker(false)}
      />

      {/* 끝 날짜 선택기 모달 */}
      <DateTimePickerModal
        isVisible={isEndDatePicker}
        mode="date"
        onConfirm={handleEndDateChange}
        onCancel={() => setEndDatePicker(false)}
      />

      {/* 시작 시간 선택기 모달 */}
      <DateTimePickerModal
        isVisible={isStartTimePicker}
        mode="time"
        onConfirm={handleStartTimeChange}
        onCancel={() => setStartTimePicker(false)}
      />

      {/* 끝 시간 선택기 모달 */}
      <DateTimePickerModal
        isVisible={isEndTimePicker}
        mode="time"
        onConfirm={handleEndTimeChange}
        onCancel={() => setEndTimePicker(false)}
      />

      <Button title="저장" onPress={handleSave} />
      <Button title="삭제" onPress={handleDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    marginRight: 10,
    padding: 8,
    fontSize: 16,
  },
  datePickerButton: {
    // Style to match your design for the button
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dateAndTime: {
    alignItems: "center",
  },
});

export default EditScreen;
