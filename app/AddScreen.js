import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Make sure to import it correctly
import styles from "./AddScreen.style";

import { router } from "expo-router";

const AddScreen = ({}) => {
  const [eventText, setEventText] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [isStartDatePicker, setStartDatePicker] = useState(false);
  const [isEndDatePicker, setEndDatePicker] = useState(false);
  const [isStartTimePicker, setStartTimePicker] = useState(false);
  const [isEndTimePicker, setEndTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleSwitch = () => setIsAllDay((previousState) => !previousState);

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
  const handleSaveEvent = () => {
    // 현지 시간대를 고려하여 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
    const formatDate = (date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split("T")[0];
    };

    // 하루 종일 이벤트인 경우 시간을 무시하고 날짜만 사용
    const finalStartDate = formatDate(startDate);
    const finalEndDate = formatDate(endDate);

    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    // 하루 종일 이벤트가 아닌 경우에만 시간 설정
    const finalStartTime = isAllDay
      ? null
      : startTime.toLocaleTimeString("ko-KR", timeOptions);
    const finalEndTime = isAllDay
      ? null
      : endTime.toLocaleTimeString("ko-KR", timeOptions);

    const newEvent = {
      text: eventText,
      startDate: finalStartDate,
      startTime: finalStartTime,
      endDate: finalEndDate,
      endTime: finalEndTime,
      isAllDay: isAllDay,
    };

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TextInput
          value={eventText}
          onChangeText={setEventText}
          style={styles.input}
          placeholder="제목"
        />
      </View>

      <View style={styles.typeList}>
        <TouchableOpacity
          onPress={() => {
            setSelectedIndex(0);
          }}
          style={styles.typeButton(selectedIndex === 0)}
        >
          <Text>asd</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedIndex(1);
          }}
          style={styles.typeButton(selectedIndex === 1)}
        >
          <Text>asd</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedIndex(2);
          }}
          style={styles.typeButton(selectedIndex === 2)}
        >
          <Text>asd</Text>
        </TouchableOpacity>
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
              <Text style={styles.timeText}>
                {startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
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
              <Text style={styles.timeText}>
                {endTime.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
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

      {/* 저장 버튼 */}
      <Button title="저장" onPress={handleSaveEvent} />
    </View>
  );
};

export default AddScreen;
