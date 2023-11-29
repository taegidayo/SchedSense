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
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Make sure to import it correctly
import styles from "./AddScreen.style";

import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  useSegments,
} from "expo-router";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore/lite";
import { db } from "../config/firebaseConfig";
import { insertScheduleData } from "../db";
import { Picker } from "@react-native-picker/picker";

const AddScreen = ({}) => {
  const segments = useSegments();
  const glob = useGlobalSearchParams();
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
  const [isGeoAlarm, setIsGeoAlarm] = useState(false);
  const [address, setAddress] = useState("");
  const [point, setPoint] = useState({});
  const [geoTime, setGeoTime] = useState(0);
  const [alarmTime, setAlarmTime] = useState(0);
  const [selectedValue, setSelectedValue] = useState("분");

  const toggleAlldaySwitch = () =>
    setIsAllDay((previousState) => !previousState);
  const toggleGeoAlarmSwitch = () => setIsGeoAlarm((prev) => !prev);

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

  useEffect(() => {
    console.log(segments);
    console.log(glob);
    setAddress(glob.address);
  }, [segments]);

  // 사용자가 저장 버튼을 누르는 등의 저장 동작을 수행하는 함수
  const handleSaveEvent = async () => {
    console.log(address);

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
      isGeoAlarm: isGeoAlarm,
      address: isGeoAlarm ? address : null,
      geoTime: isGeoAlarm ? 10 : null,
    };

    insertScheduleData(newEvent);

    await setDoc(doc(db, "user", "ss", "ss", "Ss"), newEvent);
    router.push({ pathname: "/", params: { update: true } });
  };

  const checkData = () => {
    if (eventText.length == 0) {
      return true;
    } else if (isGeoAlarm && address == undefined) {
      return true;
    } else return false;
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

      {/* 하루 종일' 스위치 섹션 */}
      <View style={styles.section}>
        <Text style={styles.label}>하루 종일</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isAllDay ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAlldaySwitch}
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

      {/* 위치 선택' 스위치 섹션 */}
      <View style={styles.section}>
        <Text style={styles.label}>위치 기반 알림</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isGeoAlarm ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleGeoAlarmSwitch}
          value={isGeoAlarm}
        />
      </View>

      <Button
        title="위치지정"
        onPress={() => {
          router.replace(`/test5`);
        }}
        disabled={!isGeoAlarm}
      />

      <View>
        <Text>{address}</Text>
      </View>

      {isGeoAlarm ? (
        <View style={styles.section}>
          <Text>도착시간 설정:</Text>
          <TextInput
            keyboardType="number-pad"
            value={geoTime}
            onChangeText={setGeoTime}
            style={styles.input}
          />
          <Text>분 전 도착</Text>
        </View>
      ) : null
      // <View style={styles.section}>
      //   <Text>알림시간 설정: 일정시작</Text>
      //   <TextInput
      //     keyboardType="number-pad"
      //     value={alarmTime}
      //     onChangeText={setAlarmTime}
      //     style={styles.input}
      //   />
      //   <Picker
      //     style={{ width: 100 }}
      //     selectedValue={selectedValue}
      //     onValueChange={(itemValue, itemIndex) =>
      //       setSelectedValue(itemValue)
      //     }
      //   >
      //     <Picker.Item label="분" value="분" />
      //     <Picker.Item label="시간" value="시간" />
      //     <Picker.Item label="일" value="일" />
      //   </Picker>

      //   <Text>전</Text>
      // </View>
      }

      {/* 저장 버튼 */}
      <View style={{ marginTop: 10 }}>
        <Button title="저장" onPress={handleSaveEvent} disabled={checkData()} />
      </View>

      {checkData() ? (
        <View>
          <Text style={styles.notice}>제목을 입력해야 합니다.</Text>
          <Text style={styles.notice}>
            또한, 위치기반 알림을 받기 위해서는 위치지정을 해야합니다.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default AddScreen;
