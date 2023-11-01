import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

function MonthView() {
  const currentDate = new Date();
  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  const daysOfMonth = eachDayOfInterval({
    start: startDay,
    end: endDay,
  });

  const weeks = [];
  let week = [];

  daysOfMonth.forEach((day, index) => {
    const dayStartOfWeek = startOfWeek(day, { weekStartsOn: 0 }); // 0은 일요일
    if (day.valueOf() === dayStartOfWeek.valueOf() || index === 0) {
      week = [];
      weeks.push(week);
    }
    week.push(day);
  });

  return (
    <View style={styles.container}>
      {weeks.map((weekDays, index) => (
        <View key={index} style={styles.weekContainer}>
          {weekDays.map((day) => (
            <Text key={day.toString()} style={styles.dateText}>
              {format(day, "d")}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function WeekView() {
  const currentDate = new Date();
  const startDay = startOfWeek(currentDate);
  const endDay = endOfWeek(currentDate);
  const daysOfWeek = eachDayOfInterval({
    start: startDay,
    end: endDay,
  });

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <Text key={day.toString()} style={styles.dateText}>
          {format(day, "d")}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  dateText: {
    flex: 1,
    textAlign: "center",
    margin: 2,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
  },
});

export { MonthView, WeekView };
