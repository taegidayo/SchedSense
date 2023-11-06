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

const Calender = ({ onDateClick }) => {
  const day = ["일", "월", "화", "수", "목", "금", "토"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [showOnlyCurrentWeek, setShowOnlyCurrentWeek] = useState(false);
  const stateRef = useRef();

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
        console.log(stateRef.current);
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

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={styles.monthHeader}>
        <Text>{format(currentDate, "yyyy년 MM월")}</Text>
      </View>

      <View style={styles.week}>
        {day.map((item, index) => (
          <Text key={index} style={styles.day}>
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

              return (
                <TouchableOpacity
                  key={dayIdx}
                  onPress={() => {
                    if (!isDragging) {
                      handleDatePress(dateItem);
                    }
                  }}
                  style={[styles.day, isOverflown ? styles.overflownDay : null]}
                >
                  <Text style={isSelected ? styles.selectedText : null}>
                    {dateItem.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthHeader: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  day: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
  },
  selectedText: {
    backgroundColor: "orange",
  },
  overflownDay: {
    backgroundColor: "gray",
  },
});

export { Calender };
