import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { router, useSegments } from "expo-router";

import { plusButton, checkButton, calendarIcon } from "../../assets";
import { Calendar, RenderItem } from "../../component";
import {
  deleteScheduleDataByID,
  getScheduleData,
  insertScheduleData,
} from "../../db";
import { getDatesBetween } from "../../utils";

const Home = () => {
  // 현재 날짜를 한국 시간대(KST)를 기준으로 설정하는 함수
  const getCurrentDateKST = () => {
    const now = new Date();
    const kstOffset = 9 * 60; // KST is UTC+9
    const localOffset = now.getTimezoneOffset();
    const kstDate = new Date(now.getTime() + (localOffset + kstOffset) * 60000);
    return kstDate.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [events, setEvents] = useState([]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const segments = useSegments();

  const scheduleUpdate = async () => {
    setEvents(await getScheduleData());
  };
  useEffect(() => {
    setTimeout(() => {
      scheduleUpdate();
    }, 1000);
  }, [segments]);

  // 확인 버튼을 눌렀을 때 실행할 함수
  const handleConfirmPress = async () => {
    if (text.length == 0) {
      return Alert.alert(
        "알림", // 대화상자의 제목
        `텍스트를 입력하여야 합니다.`, // 대화상자의 내용
        [
          {
            text: "확인",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
    } else {
      const newEvent = {
        text: text, // 사용자가 입력한 텍스트
        startDate: selectedDate, // 선택된 날짜
        endDate: selectedDate, // 종료 날짜도 선택된 날짜로 설정 (하루 종일 이벤트)
        startTime: null, // 하루 종일 이벤트이므로 시간은 null
        endTime: null, // 하루 종일 이벤트이므로 시간은 null
        allDay: true, // 하루 종일 이벤트 플래그
      };
      // await insertScheduleData(newEvent);

      // 해당 날짜에 이벤트 배열이 없다면 새 배열 생성

      // 새 이벤트 객체를 생성하여 해당 날짜의 배열에 추가
      setTimeout(() => {
        scheduleUpdate();
      }, 1000);

      setText(""); // 텍스트 입력 필드 초기화
      setModalVisible(false); // 모달 닫기
    }
  };

  // // 이벤트를 렌더링하기 위한 renderItem 함수
  // const renderItem = ({ item, index }) => (
  //   <TouchableOpacity
  //     onPress={() => editEvent(item)}
  //     onLongPress={() => deleteEvent(item)}
  //   >
  //     <View style={styles.eventItem}>
  //       <Image
  //         source={calendarIcon}
  //         style={{ ...styles.icon, opacity: index === 0 ? 1 : 0 }}
  //       />
  //       <View style={styles.eventDetails}>
  //         <Text style={styles.eventText}>{item.text}</Text>

  //         <View>
  //           <Text style={styles.eventTime}>
  //             {item.startDate}~{item.endDate}
  //           </Text>
  //           {!item.allDay ? (
  //             <Text style={styles.eventTime}>
  //               {item.startTime} - {item.endTime}
  //             </Text>
  //           ) : (
  //             <Text style={styles.eventTime}>종일</Text>
  //           )}
  //         </View>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  // AddEventScreen으로 이동하면서 새 이벤트를 추가하는 함수
  const addScreen = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      // 시작 날짜와 종료 날짜 사이의 모든 날짜를 찾아내는 로직
      const start = new Date(newEvent.startDate);
      const end = new Date(newEvent.endDate);
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const dateKey = dt.toISOString().split("T")[0];
        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = [];
        }
        updatedEvents[dateKey].push({
          text: newEvent.text,
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          allDay: newEvent.isAllDay,
        });
      }
      return updatedEvents;
    });
  };

  // 이벤트 수정을 위해 EditScreen으로 이동하는 함수
  const editEvent = (selectedEvent) => {
    router.push(`/EditScreen?id=${selectedEvent.id}`);
  };

  // 이벤트 업데이트 함수
  const updateEvent = (updatedEvent) => {
    setEventText(updatedEvent.text); // eventText 값을 업데이트합니다.
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      // 시작 날짜와 종료 날짜 사이의 모든 날짜를 찾아내는 로직
      const start = new Date(updatedEvent.startDate);
      const end = new Date(updatedEvent.endDate);
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const dateKey = dt.toISOString().split("T")[0];
        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = [];
        }
        updatedEvents[dateKey].push({
          text: updatedEvent.text,
          startDate: updatedEvent.startDate,
          endDate: updatedEvent.endDate,
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          allDay: updatedEvent.isAllDay,
        });
      }
      return updatedEvents;
    });
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

  return (
    <View style={styles.container}>
      <Calendar
        events={events}
        onDateClick={(i) => {
          setSelectedDate(formatDate(i));
        }}
      />

      {/* <ScrollView style={styles.eventContainer}> */}
      <FlatList
        data={events.filter((item) => {
          getDatesBetween(item.startDate, item.endDate);

          return (
            getDatesBetween(item.startDate, item.endDate).indexOf(
              selectedDate
            ) != -1
          );
        })}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.eventList}
      />
      {/* </ScrollView> */}

      {!modalVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addEventText}>일정 추가</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              router.push(`/AddScreen?date=${selectedDate}`);
            }}
          >
            <Image source={plusButton} style={styles.addButtonImage} />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="06시 조깅"
            onChangeText={setText} // 입력된 텍스트를 state에 저장
            value={text} // TextInput에 표시할 값
          />
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPress}
        >
          <Image source={checkButton} style={styles.checkButtonImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start", // Aligns the menu button to the left
    alignItems: "center",
    padding: 16,
    // If you have a statusBar, you might want to add some top padding here
  },
  eventContainer: {
    flex: 1,
  },
  menuIcon: {
    width: 20, // 메뉴 아이콘 크기 설정
    height: 20, // 메뉴 아이콘 크기 설정
  },
  date: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonContainer: {
    flex: 0.5,
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 버튼들 사이에 공간을 균등하게 분배합니다.
    width: "100%", // 부모 View의 전체 너비를 사용하도록 설정합니다.
  },
  addEventButton: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 40,
    backgroundColor: "#f2f2f2",
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start", // 텍스트와 이미지를 양 끝으로 정렬합니다.
    flexDirection: "row",
    borderRadius: 100,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addEventText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 14,
  },
  addButton: {
    position: "absolute", // 버튼을 부모 View에 대해 절대 위치로 설정합니다.
    bottom: 16,
    right: 10,
    // 더 이상 marginLeft를 설정할 필요가 없습니다.
  },
  addButtonImage: {
    width: 42,
    height: 40,
  },
  modalView: {
    flex: 0.5,
    position: "absolute",
    bottom: 0,
    left: -10,
    right: 40,
    backgroundColor: "#f2f2f2",
    paddingVertical: 7,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start", // 텍스트와 이미지를 양 끝으로 정렬합니다.
    flexDirection: "row",
    borderRadius: 100,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%", // 입력창의 너비를 조정하세요
    color: "gray", // 텍스트 색상을 회색으로 변경
  },
  confirmButton: {
    position: "absolute",
    right: 10, // 오른쪽에 20의 여백을 두고 배치합니다.
    top: "91%", // 상단에서 50%의 위치에 배치합니다.
    transform: [{ translateY: -25 }], // 버튼을 Y축으로 절반만큼 올립니다.
    // 배경색은 이미 투명으로 설정되어 있습니다.
  },
  checkButtonImage: {
    width: 50, // 이미지 크기 조절
    height: 50,
  },
  eventList: {
    flex: 1,
  },
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

export default Home;
