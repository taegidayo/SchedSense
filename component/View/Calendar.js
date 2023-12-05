import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  getDay,
} from "date-fns";
import { db } from "../../config/firebaseConfig";
import { getEventLevel } from "../../utils";

const Calendar = ({ onDateClick, events }) => {
  const day = ["일", "월", "화", "수", "목", "금", "토"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [showOnlyCurrentWeek, setShowOnlyCurrentWeek] = useState(false);
  const stateRef = useRef();
  const [uniqueStartDatesArray, setUniqueStartDatesArray] = useState([]);

  /**  해당 날짜에 이벤트의 수룰 체크하기 위한 변수, 다음과 같은 형식으로 이루어질 예정, 이벤트는 4개까지만 확인
    {
       {날짜}:{
        1:{이벤트 아이디}
        2:{이벤트 아이디}
        3:{이벤트아이디}
        4:{이벤트아이디}
       }
    }
*/
  const [eventLevel, setEventLevel] = useState({});

  // 객체를 사용하여 중복을 체크
  useEffect(() => {
    const uniqueStartDates = {};
    events = events.sort((a, b) => {
      // startDate와 startTime을 결합한 문자열 생성
      const dateTimeA = `${a.startDate} ${a.startTime}`;
      const dateTimeB = `${b.startDate} ${b.startTime}`;

      // 문자열 비교
      return dateTimeA.localeCompare(dateTimeB);
    });

    // jsonArray를 순회하며 startDate가 객체에 없으면 추가

    if (typeof events == "object")
      events.forEach((item) => {
        uniqueStartDates[item.startDate] = true;
      });

    // 객체의 키들을 배열로 변환
    setUniqueStartDatesArray(Object.keys(uniqueStartDates));
    // catchEventLevels();

    getEventLevel(events, setEventLevel);
  }, [events]);

  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    stateRef.current = showOnlyCurrentWeek;
  }, [showOnlyCurrentWeek]);

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          setIsDragging(true);
          return true;
        }
        return false;
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderEnd: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          if (stateRef.current) {
            setCurrentDate((prev) => addWeeks(prev, 1));
          } else {
            setCurrentDate((prev) => addMonths(prev, 1));
          }
        } else if (gestureState.dx > 50) {
          if (stateRef.current) {
            setCurrentDate((prev) => subWeeks(prev, 1));
          } else {
            setCurrentDate((prev) => subMonths(prev, 1));
          }
        } else if (gestureState.dy < -50) {
          setShowOnlyCurrentWeek(true);
        } else if (gestureState.dy > 50) {
          setShowOnlyCurrentWeek(false);
        }
      },
    })
  ).current;

  const weeks = eachWeekOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const currentWeek = weeks.find(
    (week) =>
      currentDate >= new Date(week) &&
      currentDate <= new Date(week).setDate(week.getDate() + 6)
  );

  const weeksToShow = showOnlyCurrentWeek ? [currentWeek] : weeks;

  const catchEventLevels = () => {
    setEventLevel({});

    events.forEach((item, index) => {
      var datesArray = getDatesBetween(item.startDate, item.endDate);
      setEventLevel((prev) => {
        var value = prev;
        var level = 1; //이벤트가 있을 경우 밑줄이 그어질 예정... 해당 이벤트의 경우 전부 같은 라인에 밑줄이 그어지게 하기 위함.

        datesArray.forEach((itemA, indexA) => {
          // json
          if (indexA == 0 && prev.hasOwnProperty(itemA)) {
            if (!prev[itemA].hasOwnProperty("1")) {
              level = 1;
            } else if (!prev[itemA].hasOwnProperty("2")) {
              level = 2;
            } else if (!prev[itemA].hasOwnProperty("3")) {
              level = 3;
            } else if (!prev[itemA].hasOwnProperty("4")) {
              level = 4;
            } else level = undefined;
            if (level != undefined) {
              value[itemA][level] = item.id;
            }
          } else if (indexA == 0) {
            value[itemA] = {
              1: item.id,
            };
          } else if (level != undefined) {
            if (prev.hasOwnProperty(itemA)) {
              value[itemA][level] = item.id;
            } else {
              value[itemA] = {
                [level]: item.id,
              };
            }
          }
        });
        return value;
      });
    });
  };

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={styles.monthHeader}>
        <Text>{format(currentDate, "yyyy년 MM월")}</Text>
      </View>

      <View style={styles.week}>
        {day.map((item, index) => (
          <Text key={index} style={styles.dayIndex}>
            {item}
          </Text>
        ))}
      </View>

      {weeksToShow.map((weekStart, index) => (
        <View key={index} style={styles.week}>
          {Array(7)
            .fill(null)
            .map((_, dayIdx) => {
              const dateItem = new Date(weekStart);
              dateItem.setDate(weekStart.getDate() + dayIdx);

              const isSelected =
                selectedDate.getDate() === dateItem.getDate() &&
                selectedDate.getMonth() === dateItem.getMonth();

              const isOverflown =
                dateItem.getMonth() !== currentDate.getMonth();

              const handleDatePress = (date) => {
                setSelectedDate(date);
                onDateClick(date);
                setCurrentDate(date);
              };

              let [level1, level2, level3, level4] = [
                false,
                false,
                false,
                false,
              ];
              var dateString = formatDate(dateItem);

              if (eventLevel.hasOwnProperty(dateString)) {
                if (eventLevel[dateString].hasOwnProperty(1)) {
                  level1 = true;
                }
                if (eventLevel[dateString].hasOwnProperty(2)) {
                  level2 = true;
                }
                if (eventLevel[dateString].hasOwnProperty(3)) {
                  level3 = true;
                }
                if (eventLevel[dateString].hasOwnProperty(4)) {
                  level4 = true;
                }
              }
              return (
                <TouchableOpacity
                  key={dayIdx}
                  onPress={() => {
                    if (!isDragging) {
                      handleDatePress(dateItem);
                    }
                  }}
                  style={[styles.day, isSelected ? styles.focus : null]}
                >
                  <Text style={isOverflown ? styles.overflownDay : null}>
                    {dateItem.getDate()}
                  </Text>
                  <View
                    style={{
                      height: 2,
                      backgroundColor: level1 ? "red" : "#FFFFFF",
                      width: "100%",
                      marginTop: 5,
                    }}
                  />
                  <View
                    style={{
                      height: 2,
                      backgroundColor: level2 ? "blue" : "#FFFFFF",
                      width: "100%",
                      marginTop: 0.5,
                    }}
                  />
                  <View
                    style={{
                      height: 2,
                      backgroundColor: level3 ? "#00FF00" : "#FFFFFF",
                      width: "100%",
                      marginTop: 0.5,
                    }}
                  />
                  <View
                    style={{
                      height: 2,
                      backgroundColor: level4 ? "green" : "#FFFFFF",
                      width: "100%",
                      marginTop: 0.5,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  monthHeader: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,

    borderBottomColor: "grey",
  },
  week: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayIndex: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },

  day: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
  focus: {
    borderWidth: 1,
    borderColor: "black",
  },
  overflownDay: {
    color: "gray",
  },
});

export { Calendar };
