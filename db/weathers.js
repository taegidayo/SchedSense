import * as SQLite from "expo-sqlite";

const insertWeatherData = () => {
  try {
    const db = SQLite.openDatabase("db.db");

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      const weatherData = {
        PCP: "강수없음",
        POP: "0",
        PTY: "0",
        REH: "70",
        SKY: "1",
        SNO: "적설없음",
        TMP: "9",
        UUU: "0.1",
        VEC: "189",
        VVV: "0.6",
        WAV: "0",
        WSD: "0.6",
        baseDate: "20231121",
        baseTime: "1700",
        fcstDate: "20231121",
        fcstTime: "1801",
      };

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

      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO weather (PCP, POP, PTY, REH, SKY, SNO, TMP, UUU, VEC, VVV, WAV, WSD, baseDate, baseTime, fcstDate, fcstTime) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            weatherData.PCP,
            weatherData.POP,
            weatherData.PTY,
            weatherData.REH,
            weatherData.SKY,
            weatherData.SNO,
            weatherData.TMP,
            weatherData.UUU,
            weatherData.VEC,
            weatherData.VVV,
            weatherData.WAV,
            weatherData.WSD,
            weatherData.baseDate,
            weatherData.baseTime,
            weatherData.fcstDate,
            weatherData.fcstTime,
          ]
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM weather;",
          [],
          (_, { rows }) => {
            console.log(JSON.stringify(rows));
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

export { insertWeatherData };
