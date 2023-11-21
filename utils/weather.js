import { checkWeatherData, insertWeatherData } from "../db";

const getFormattedDate = (date) => {
  let year = date.getFullYear(); // 년도
  let month = date.getMonth() + 1; // 월 (0에서 시작하므로 1을 더함)
  let day = date.getDate(); // 일

  // 월과 일이 10보다 작으면 앞에 0을 붙여서 두 자리로 만듦
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}${month}${day}`;
};

/**
 * @description  기상청에서 날씨를 발표하는 시각을 반환하는 함수
 *
 * @returns {{baseDate:string,baseTime:string}} 각각 발표기준일자와 발표기준시각에 대해 반환
 */
const getBaseTime = () => {
  // 기상 단기예보가 발표되는 시각, 단 api로는 10분뒤부터 제공됨
  const baseTime = ["0200", "0500", "0800", "1100", "1400", "1700", "2300"];
  const time = ["0210", "0510", "0810", "1110", "1410", "1710", "2310"];

  var timeindex = 0;
  var now = new Date();

  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentTimeString = currentHours + currentMinutes;
  if (currentTimeString < time[0]) {
    timeindex = 6;
  } else if (currentTimeString < time[1]) {
    timeindex = 0;
  } else if (currentTimeString < time[2]) {
    timeindex = 1;
  } else if (currentTimeString < time[3]) {
    timeindex = 2;
  } else if (currentTimeString < time[4]) {
    timeindex = 3;
  } else if (currentTimeString < time[5]) {
    timeindex = 4;
  } else {
    timeindex = 5;
  }
  if (baseTime[timeindex] > currentTimeString) {
    now.setDate(now.getDate() - 1);
  }

  return { baseDate: getFormattedDate(now), baseTime: baseTime[timeindex] };
};

/**
 *
 * @param {number} x
 * @param {number} y
 *
 * @description x와 y의 좌표값을 입력하면 해당 지역의 날씨를 전달해주는 함수
 *
 * @return {object} 날씨 정보가 있는 JSON ARRAY를 반환함. 각 객체정보는 {basetime:업데이트시간,baseDate:업데이트일자,fcstTime:해당날씨 시간,fcstDate,해당날씨 일자,기타(README.md확인)}
 */

const getWeatherByPoint = async (x, y) => {
  var finalArray = [];
  //###################################################x,y값과 날짜를 기반으로 api url을 완성시키는 코드################################################
  var url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.EXPO_PUBLIC_API_KEY}&pageNo=1&numOfRows=1000&dataType=json`;

  const { baseDate, baseTime } = getBaseTime();
  const isLatest = await checkWeatherData(baseDate, baseTime);
  console.log(isLatest, 1);

  if (true) {
  } else {
    console.log(baseDate, baseTime);
    url = url + `&base_date=${baseDate}&base_time=${baseTime}&nx=${x}&ny=${y}`;
    //todo 제거하기

    //#####생성된 apiurl을 기반으로 fetch함수를 사용해 받아온 값을 기반으로 같은 날짜,같은 시간인 item을 합치고, 다듬는 과정
    await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const grouped = json.response.body.items.item.reduce((acc, item) => {
          const key = item.fcstTime + "_" + item.fcstDate;
          if (!acc[key]) {
            acc[key] = {
              baseDate: item.baseDate,
              baseTime: item.baseTime,
              fcstTime: item.fcstTime,
              fcstDate: item.fcstDate,

              [item.category]: item.fcstValue,
            };
          } else {
            acc[key][item.category] = item.fcstValue;
          }
          return acc;
        }, {});
        finalArray = Object.values(grouped);

        finalArray.sort((a, b) => {
          if (a.fcstDate === b.fcstDate) {
            return a.fcstTime.localeCompare(b.fcstTime);
          }
          return a.fcstDate.localeCompare(b.fcstDate);
        });
      });

    insertWeatherData(finalArray);
    console.log(finalArray[0]);
  }
  return finalArray;
};

export { getBaseTime, getWeatherByPoint };
