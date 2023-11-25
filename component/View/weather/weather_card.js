import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
const WeatherCardView = ({ weather }) => {
  const [skyIcon, setSkyIcon] = useState("");
  const [skyStr, setSkyStr] = useState("");

  useEffect(() => {
    switch (parseInt(weather.PTY)) {
      case 0:
        switch (parseInt(weather.SKY)) {
          case 1:
            setSkyIcon("sun");
            setSkyStr("맑음");
            break;
          case 3:
            setSkyIcon("cloud-sun");
            setSkyStr("구름많음");
            break;
          case 4:
            setSkyIcon("cloud");
            setSkyStr("흐림");
            break;
          default:
            setSkyIcon("sunny");

            break;
        }
        break;
      case 1:
        setSkyIcon("cloud-rain");
        setSkyStr("비");
        break;
      case 2:
        setSkyIcon("cloud-rain");
        setSkyStr("눈/비");
        break;
      case 3:
        setSkyIcon("snowflake");
        setSkyStr("눈");
        break;
      case 4:
        setSkyIcon("rain");
        setSkyStr("소나기");
        break;
    }
  }, []);

  return (
    <View style={styles.item}>
      <Text style={styles.date}>
        {weather.fcstDate.substring(4, 6)}/{weather.fcstDate.substring(6, 8)}
      </Text>
      <Text style={styles.time}>{weather.fcstTime}</Text>

      <FontAwesome5 name={skyIcon} size={20} color="black" />
      <Text style={styles.skyStr}>{skyStr}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    height: 70,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
  },
  skyStr: {
    fontWeight: "bold",
  },
});
export { WeatherCardView };
