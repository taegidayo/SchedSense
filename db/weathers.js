import * as SQLite from "expo-sqlite";

/**
 *
 * @param {Object} weatherData 날씨 데이터 '리스트'
 *
 *
 * @description 날씨 api에서 가져온 데이터를 sqlite DB에 삽입하기 위한 함수
 *
 *
 */
const insertWeatherData = async (weatherData, x, y) => {
  try {
    const db = SQLite.openDatabase("db.db");

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS weather (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          LOC_X INTEGER,
          LOC_Y INTEGER,
          PCP TEXT,
          POP TEXT,
          PTY TEXT,
          REH TEXT,
          SKY TEXT,
          SNO TEXT,
          TMP TEXT,
          UUU TEXT,
          VEC TEXT,
          VVV TEXT,
          WAV TEXT,
          WSD TEXT,
          baseDate TEXT,
          baseTime TEXT,
          fcstDate TEXT,
          fcstTime TEXT
        );`
      );

      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM weather;",
          [],
          () => {},
          (_, error) => {
            console.log("Delete Error: ", error);
          }
        );
      });

      db.transaction(
        (tx) => {
          weatherData.forEach((data) => {
            data.fcstTime = parseInt(data.fcstTime.slice(0, 2));

            if (data.fcstTime > 12) {
              data.fcstTime = `오후 ${(data.fcstTime - 12)
                .toString()
                .padStart(2, "0")}시`;
            } else if (data.fcstTime == 12) {
              data.fcstTime = `오후 12시`;
            } else {
              data.fcstTime = `오전 ${data.fcstTime
                .toString()
                .padStart(2, "0")}시`;
            }

            tx.executeSql(
              `INSERT INTO weather (LOC_X,LOC_Y,PCP, POP, PTY, REH, SKY, SNO, TMP, UUU, VEC, VVV, WAV, WSD, baseDate, baseTime, fcstDate, fcstTime)
              VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                x,
                y,
                data.PCP,
                parseInt(data.POP),
                parseInt(data.PTY),
                parseInt(data.REH),
                parseInt(data.SKY),
                data.SNO,
                parseInt(data.TMP),
                parseInt(data.UUU),
                data.VEC,
                data.VVV,
                data.WAV,
                data.WSD,
                data.baseDate,
                data.baseTime,
                data.fcstDate,
                data.fcstTime,
              ]
            );
          });
        },
        (error) => {},
        () => {}
      );
    });
  } catch (error) {
    console.log(err);
  }
};

/**
 * @description 날씨 데이터가 최신 데이터인지 파악하는 코드(api를 최소한으로 불러오기 위해 사용)
 *
 * @param {string} baseTime
 * @param {string} baseDate
 *
 * @return {boolean} isLatest  true:최신데이터, false: 업데이트 필요
 *
 *
 */
const checkWeatherData = async (x, y, baseDate, baseTime) => {
  const db = SQLite.openDatabase("db.db");

  try {
    return new Promise((resolve, reject) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        LOC_X INTEGER,
        LOC_Y INTEGER,
        PCP TEXT,
        POP TEXT,
        PTY TEXT,
        REH TEXT,
        SKY TEXT,
        SNO TEXT,
        TMP TEXT,
        UUU TEXT,
        VEC TEXT,
        VVV TEXT,
        WAV TEXT,
        WSD TEXT,
        baseDate TEXT,
        baseTime TEXT,
        fcstDate TEXT,
        fcstTime TEXT
      );`
      );

      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM weather WHERE loc_x = ? AND loc_y = ? AND baseDate = ? AND baseTime = ?;`,
          [x, y, baseDate, baseTime],
          (_, result) => {
            let data = [];
            for (let i = 0; i < result.rows.length; i++) {
              data.push(result.rows.item(i));
            }
            resolve(data); // 반환할 데이터
            // }
            //  else {
            // 일치하는 레코드가 없습니다.
            // resolve(false);
            // }
          },
          (_, error) => {
            // 쿼리 실행 중 오류 발생
            reject(error);
          }
        );
      });
    });
  } catch (exception) {
    return [];
  }
};

const selectWeatherData = async () => {
  const db = SQLite.openDatabase("db.db");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS weather (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          LOC_X INTEGER,
          LOC_Y INTEGER,
          PCP TEXT,
          POP TEXT,
          PTY TEXT,
          REH TEXT,
          SKY TEXT,
          SNO TEXT,
          TMP TEXT,
          UUU TEXT,
          VEC TEXT,
          VVV TEXT,
          WAV TEXT,
          WSD TEXT,
          baseDate TEXT,
          baseTime TEXT,
          fcstDate TEXT,
          fcstTime TEXT
        );`
      );

      tx.executeSql(
        `SELECT * FROM weather ;`,
        [],
        (_, result) => {
          let data = [];
          for (let i = 0; i < result.rows.length; i++) {
            data.push(result.rows.item(i));
          }
          resolve(data); // 반환할 데이터
        },
        (_, error) => {
          // 쿼리 실행 중 오류 발생
          reject(error);
        }
      );
    });
  });
};

export { insertWeatherData, checkWeatherData, selectWeatherData };
