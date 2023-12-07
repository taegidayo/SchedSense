import * as SQLite from "expo-sqlite";

/**
 *
 * @param {Object} data event 텍스트와 기타등등.
 *
 *
 * @description 날씨 api에서 가져온 데이터를 sqlite DB에 삽입하기 위한 함수
 *
 *
 */
const insertScheduleData = async (data) => {
  try {
    const db = SQLite.openDatabase("db.db");

    db.transaction((tx) => {
      // todo 데이터테이블을 초기화 할 때 주석지우고 사용

      //데이터테이블이 없을 경우 테이블을 생성
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );

      //데이터 삽입1
      db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO schedule (text,startDate,startTime, endDate, endTime, isAllDay, noticeTime, isWantNotice, useLocation,startLat,startLong,startAddress, arriveLat, arriveLong, arriveAddress,totalTime)
              VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`,
            [
              data.text,
              data.startDate,
              data.startTime,
              data.endDate,
              data.endTime,
              data.isAllDay,
              data.alarmTime,
              data.isWantNotice,
              data.isGeoAlarm,
              data.startLat,
              data.startLong,
              data.startAddress,
              data.arriveLat,
              data.arriveLong,
              data.arriveAddress,
              data.totalTime,
            ]
          );
        },
        (error) => {
          console.log(error);
        },
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
const getScheduleData = async () => {
  const db = SQLite.openDatabase("db.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );

      tx.executeSql(
        `SELECT * FROM schedule;`,
        [],
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
};

const getScheduleDataByUseLocation = async () => {
  const db = SQLite.openDatabase("db.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );
      tx.executeSql(
        `SELECT * FROM schedule WHERE useLocation= ?;`,
        [1],
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
};

const getScheduleDataByID = async (id) => {
  const db = SQLite.openDatabase("db.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );
      tx.executeSql(
        `SELECT * FROM schedule WHERE ID= ?;`,
        [id],
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
};

const deleteScheduleDataByID = async (id) => {
  const db = SQLite.openDatabase("db.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );
      tx.executeSql(
        `DELETE FROM schedule WHERE ID= ?;`,
        [id],
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
};

const updateScheduleData = async (id, data) => {
  console.log(data);
  try {
    const db = SQLite.openDatabase("db.db");

    db.transaction((tx) => {
      // todo 데이터테이블을 초기화 할 때 주석지우고 사용
      // tx.executeSql(`DROP TABLE IF  EXISTS schedule ;`);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          startDate TEXT,
          startTime TEXT,
          endDate TEXT,
          endTime TEXT,
          isAllDay bool,
          noticeTime INTEGER,
          isWantNotice bool,
          useLocation bool,
          startLat float,
          startLong float,
          startAddress text,
          arriveLat float,
          arriveLong float,
          arriveAddress text ,
          totalTime INTEGER,
        );`
      );

      //데이터 삽입1
      db.transaction(
        (tx) => {
          tx.executeSql(
            `UPDATE schedule SET text=?,startDate=?,startTime=?, endDate=?, endTime=?, isAllDay=?, noticeTime=?, isWantNotice=?, useLocation=?,startLat=?,startLong=?,startAddress=?, arriveLat=?, arriveLong=?, arriveAddress=?,totalTime=? WHERE id=?;`,
            [
              data.text,
              data.startDate,
              data.startTime,
              data.endDate,
              data.endTime,
              data.isAllDay,
              data.alarmTime,
              data.isWantNotice,
              data.useLocation,
              data.startLat,
              data.startLong,
              data.startAddress,
              data.arriveLat,
              data.arriveLong,
              data.arriveAddress,
              data.totalTime,
              id,
            ]
          );
        },
        (error) => {
          console.log(error);
        },
        () => {}
      );
    });
  } catch (error) {
    console.log(err);
  }
};

export {
  insertScheduleData,
  getScheduleData,
  getScheduleDataByID,
  deleteScheduleDataByID,
  updateScheduleData,
  getScheduleDataByUseLocation,
};
