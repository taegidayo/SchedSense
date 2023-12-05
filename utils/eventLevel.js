/**
 *
 * @param {string} startDate 이벤트의 시작날짜
 * @param {string} endDate 이벤트의 종료날짜
 * @returns [... string]
 */
const getDatesBetween = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  let end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

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
const getEventLevel = (events, setEventLevel) => {
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

export { getEventLevel, getDatesBetween };
