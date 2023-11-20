getFormattedDate = (date) => {
  let year = date.getFullYear(); // 년도
  let month = date.getMonth() + 1; // 월 (0에서 시작하므로 1을 더함)
  let day = date.getDate(); // 일

  // 월과 일이 10보다 작으면 앞에 0을 붙여서 두 자리로 만듦
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}${month}${day}`;
};

/**
 *
 * @param {number} x
 * @param {number} y
 *
 * x와 y의 좌표값을 입력하면 해당 지역의 날씨를 전달해주는 함수
 */
const getWeatherByPoint = async (x, y) => {
  console.log(x, y);

  //###################################################x,y값과 날짜를 기반으로 api url을 완성시키는 코드################################################
  var url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.EXPO_PUBLIC_API_KEY}&pageNo=1&numOfRows=1000&dataType=json`;

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

  url =
    url +
    `&base_date=${getFormattedDate(now)}&base_time=${
      baseTime[timeindex]
    }&nx=${x}&ny=${y}`;
  //todo 제거하기
  console.log(url);

  //#####생성된 apiurl을 기반으로 fetch함수를 사용해 받아온 값을 기반으로 같은 날짜,같은 시간인 item을 합치고, 다듬는 과정
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json.response.body.items.item[0]);

      const grouped = json.response.body.items.item.reduce((acc, item) => {
        const key = item.fcstTime + "_" + item.fcstDate;
        if (!acc[key]) {
          acc[key] = {
            fcstTime: item.fcstTime,
            fcstDate: item.fcstDate,
            [item.category]: item.fcstValue,
          };
        } else {
          acc[key][item.category] = item.fcstValue;
        }
        return acc;
      }, {});

      const finalArray = Object.values(grouped);

      finalArray.sort((a, b) => {
        if (a.fcstDate === b.fcstDate) {
          return a.fcstTime.localeCompare(b.fcstTime);
        }
        return a.fcstDate.localeCompare(b.fcstDate);
      });

      console.log(finalArray);
    });

  return "123";
};

export { getWeatherByPoint };
