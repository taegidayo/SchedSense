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
const insertWeatherData = async (weatherData) => {
  try {
    const db = SQLite.openDatabase("db.db");

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        PCP TEXT,
        POP INTEGER,
        PTY INTERGER,
        REH INTERGER,
        SKY INTERGER,
        SNO TEXT,
        TMP INTERGER,
        UUU INTERGER,
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
          () => {
            console.log("All data deleted from 'weather' table.");
          },
          (_, error) => {
            console.log("Delete Error: ", error);
          }
        );
      });

      db.transaction(
        (tx) => {
          weatherData.forEach((data) => {
            tx.executeSql(
              `INSERT INTO weather (PCP, POP, PTY, REH, SKY, SNO, TMP, UUU, VEC, VVV, WAV, WSD, baseDate, baseTime, fcstDate, fcstTime) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
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
        (error) => {
          console.log("Transaction Error: ", error);
        },
        () => {
          console.log("Transaction Success");
        }
      );

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM weather;",
          [],
          (_, { rows }) => {
            // console.log(JSON.stringify(rows));
          },
          (_, error) => {
            console.log("Query Error: ", error);
          }
        );
      });
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
const checkWeatherData = async (baseDate, baseTime) => {
  const db = SQLite.openDatabase("db.db");

  var isLatest = false;
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM weather WHERE baseDate = ? AND baseTime = ?;`,
        [baseDate, baseTime],
        (_, result) => {
          console.log(1);
          if (result.rows.length > 0) {
            // baseDate와 baseTime이 일치하는 레코드가 존재합니다.
            console.log(1);
            resolve(true);
          } else {
            console.log(2);
            // 일치하는 레코드가 없습니다.
            resolve(false);
          }
        },
        (_, error) => {
          console.log(error);
          // 쿼리 실행 중 오류 발생
          reject(error);
        }
      );
    });
  });
};

export { insertWeatherData, checkWeatherData };
