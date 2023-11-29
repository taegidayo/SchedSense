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
    color: "black",
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
  notice: {
    color: "red",
  },
});

export default styles;
