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

export { WeekView };
