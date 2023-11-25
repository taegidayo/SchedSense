import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { WeatherCardView } from "./weather_card";
import { LineChart } from "react-native-chart-kit";

/**
 *
 *
 * @description 인자로 받은 날씨데이터들을 그래프로 출력하는 코드
 *
 */
const WeatherListView = ({ weatherData }) => {
  const data = {
    labels: [weatherData.map((item) => item.TMP)], // X축 레이블 (시간)
    datasets: [
      {
        data: weatherData.map((item) => item.TMP), // Y축 데이터 (기온)
      },
    ],
  };

  return (
    <View>
      <ScrollView horizontal={true} style={{ height: 130 }}>
        <View>
          <View
            style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
          >
            <View style={{ paddingRight: 28 }} />
            {weatherData.map((item, index) => {
              return <WeatherCardView key={index} weather={item} />;
            })}
          </View>

          <LineChart
            data={data}
            width={weatherData.length * 68.5} // 가로 길이
            height={50} // 세로 길이를 늘려서 길게 표시
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0, // 소수점 자리
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // 선 색상
              labelColor: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // 레이블 색상
            }}
            withOuterLines={false}
            withInnerLines={false}
            withHorizontalLabels={false}
            renderDotContent={({ x, y, index }) => (
              <View
                key={index}
                style={{ position: "absolute", left: x - 10, top: y - 20 }}
              >
                <Text style={{ fontSize: 12 }}>
                  {parseInt(data.datasets[0].data[index])}°
                </Text>
              </View>
            )}
            bezier // 부드러운 곡선 스타일
            style={{
              height: 50,
              borderRadius: 16,
            }}
          />

          {/* <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ paddingRight: 56 }} />
            {weatherData.map((item, index) => {
              return (
                <Text
                  key={index}
                  style={{
                    paddingRight: 50.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {parseInt(item.TMP)}°
                </Text>
              );
            })}
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
export { WeatherListView };
