import { StyleSheet } from "react-native";

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
  typeList: {
    flexDirection: "row",
    flex: 0.1,

    backgroundColor: "lightgreen",
  },
  typeButton: (selected) => ({
    backgroundColor: selected ? "#AAA" : "#DDD",
    flex: 0.333333,
    justifyContent: "center",
    alignItems: "center",
  }),
});

export default styles;
