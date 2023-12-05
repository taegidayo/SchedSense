import { useEffect, useRef, useState } from "react";
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
import styles from "./EditScreen.style";

import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  useSegments,
} from "expo-router";
import { setDoc, doc } from "firebase/firestore/lite";
import { getScheduleDataByID, insertScheduleData } from "../db";
import { Picker } from "@react-native-picker/picker";

const EditScreen = ({}) => {
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
  const [startAddress, setStartAddress] = useState("");
  const [arriveAddress, setArriveAddress] = useState("");
  const [point, setPoint] = useState({});
  const [geoTime, setGeoTime] = useState(0);
  const [alarmTime, setAlarmTime] = useState(0);

  const [arriveDatePicker, setArriveDatePicker] = useState(false);
  const [arriveTimePicker, setArriveTimePicker] = useState(false);
  const [arriveDate, setArriveDate] = useState(new Date());
  const [arriveTime, setArriveTime] = useState(new Date());
  const [useAlram, setUseAlarm] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const toggleAlldaySwitch = () =>
    setIsAllDay((previousState) => !previousState);
  const toggleGeoAlarmSwitch = () => setIsGeoAlarm((prev) => !prev);

  const toggleUseAlramSwitch = () =>
    setUseAlarm((previousState) => !previousState);

  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setStartDatePicker(false);
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate);
    setEndDatePicker(false);
  };

  const handleStartTimeChange = (selectedTime) => {
    console.log(selectedTime);
    setStartTime(selectedTime);
    setStartTimePicker(false);
  };

  const handleEndTimeChange = (selectedTime) => {
    setEndTime(selectedTime);
    setEndTimePicker(false);
  };

  useEffect(() => {
    if (glob.id != undefined) loadScheduleData();
    if (glob.arriveAddress != undefined) {
      setArriveAddress(glob.arriveAddress);
      setStartAddress(glob.startAddress);
      setTotalTime(glob.totalTime);
    }
  }, [segments]);

  function convertTimeStringToDate(timeString) {
    const currentTime = new Date(); // 현재 날짜 및 시간
    const [period, time] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // 오후인 경우 시간 조정 (12시간 제외)
    if (period === "오후" && hours !== 12) {
      hours += 12;
    }
    // 오전 12시인 경우 0시로 조정
    if (period === "오전" && hours === 12) {
      hours = 0;
    }

    currentTime.setHours(hours, minutes, 0, 0); // 시, 분, 초, 밀리초 설정

    return currentTime;
  }

  /**
   * editScreen에 들어올 때 받은 params의 id값을 기반으로 db에 있는 데이터를 가져오는 함수
   *
   */
  const loadScheduleData = async () => {
    const data = await getScheduleDataByID(glob.id);

    console.log(data);
    setEventText(data[0].text);
    setIsAllDay(data[0].isAllDay);
    setStartDate(new Date(data[0].startDate));
    setEndDate(new Date(data[0].endDate));
    setUseAlarm(data[0].isWantNotice);

    setIsGeoAlarm(data[0].useLocation);

    if (!data[0].isAllDay) {
      setStartTime(convertTimeStringToDate(data[0].startTime));
      setEndDate(convertTimeStringToDate(data[0].endTime));
    }
    if (data[0].useLocation) {
      setArriveAddress(data[0].arriveAddress);
      setStartAddress(data[0].startAddress);
      setTotalTime(data[0].totalTime);
    }
    setAlarmTime(data[0].noticeTime);
  };

  // 사용자가 저장 버튼을 누르는 등의 저장 동작을 수행하는 함수
  const handleSaveEvent = async () => {
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

      startLat: isGeoAlarm ? glob.startLat : null,
      startLong: isGeoAlarm ? glob.startLong : null,
      startAddress: isGeoAlarm ? startAddress : null,
      arriveLat: isGeoAlarm ? glob.arriveLat : null,
      arriveLong: isGeoAlarm ? glob.arriveLong : null,
      arriveAddress: isGeoAlarm ? arriveAddress : null,
      totalTime: isGeoAlarm ? totalTime : null,
      useAlarm: true,
      alarmTime: alarmTime,
    };

    insertScheduleData(newEvent);

    // await setDoc(doc(db, "user", "ss", "ss", "Ss"), newEvent);
    router.push({ pathname: "/", params: { update: true } });
  };

  const checkData = () => {
    if (eventText.length == 0) {
      return 1;
    } else if (isGeoAlarm && arriveAddress == undefined) {
      return 2;
    } else return 0;
  };

  //알람 시간 선택을 위한 picker의 Ref
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

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
          router.replace(`/Maps?Page=AddScreen`);
        }}
        disabled={!isGeoAlarm}
      />
      {isGeoAlarm ? (
        <View>
          <Text>도착지:{arriveAddress}</Text>
        </View>
      ) : null}
      {totalTime != undefined ? (
        <View>
          <Text>예상 소요시간: {totalTime}</Text>
        </View>
      ) : null}

      {/* 위치 선택' 스위치 섹션 */}
      <View style={styles.section}>
        <Text style={styles.label}>알림 사용</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={useAlram ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleUseAlramSwitch}
          value={useAlram}
        />
      </View>
      {/* 알람시간을 선택하는 선택 창. */}
      {useAlram ? (
        <Picker
          ref={pickerRef}
          selectedValue={alarmTime}
          onValueChange={(itemValue, itemIndex) => setAlarmTime(itemValue)}
        >
          <Picker.Item
            label={`${isGeoAlarm ? "도착" : ""} 10분 전 알림`}
            value={10}
          />
          <Picker.Item
            label={`${isGeoAlarm ? "도착" : ""}20분 전`}
            value={20}
          />
          <Picker.Item
            label={`${isGeoAlarm ? "도착" : ""}30분 전`}
            value={30}
          />
          <Picker.Item
            label={`${isGeoAlarm ? "도착" : ""}1시간 전`}
            value={60}
          />
        </Picker>
      ) : null}

      {/* 저장 버튼 */}
      <View style={{ marginTop: 10 }}>
        <Button title="저장" onPress={() => {}} />
        <Button title="삭제" onPress={() => {}} color="red" />
      </View>
      {checkData() != 0 ? (
        <View>
          <Text style={styles.notice}>
            {checkData() == 1
              ? "제목을 입력해야 합니다."
              : "위치기반 알림을 받기 위해서는 위치지정을 해야합니다."}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default EditScreen;
