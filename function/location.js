import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import Papa from "papaparse";

/**
 *
 * @param {string} csvData csv파일에서 읽어온 string값
 * @returns {JSON} csv데이터를 json으로 변환한 값을 반환
 */
const convertCSVToJSON = (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: function (results) {
        resolve(results.data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var lon1 = coords1.long;
  var lat1 = coords1.lat;

  var lon2 = coords2.long;
  var lat2 = coords2.lat;

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

function findClosestLocation(targetCoords, locations) {
  let closest = null;
  let closestDistance = Infinity;

  locations.forEach((location) => {
    if (
      typeof location.level2 === "string" &&
      location.level2.length > 0 &&
      typeof location.level3 === "string" &&
      location.level3.length > 0
    ) {
      let distance = haversineDistance(targetCoords, location);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = location;
      }
    }
  });

  return closest;
}

/**
 *
 * @param {string} level1
 * @param {string} level2
 * @param {string} level3
 * @param {{lat:number,long:number}}
 *
 * 함수 로직:
 *
 *
 * @returns {{X:number,Y:number}} 기상청에서 제공한 "기상청41_단기예보 조회서비스_오픈API활용가이드_격자_위경도(20230611)파일에서 있는 격자X,격자Y값을 기반으로 함."
 */
const getLocation = async (level1, level2, level3, point) => {
  const csvData = await fetch(
    "https://sched-sense-server.vercel.app/location.csv"
  ).then((response) => response.text());
  const jsonData = await convertCSVToJSON(csvData);

  var data = jsonData.filter(
    (row) =>
      row.level1 === level1 && row.level2 === level2 && row.level3 === level3
  )[0];

  /*만약 문제가 생겨 level1과 level2,level3중 하나에 값이 이상한 값이 들어올 경우
    data의 타입이 undefind, 즉 아무 내용도 없게 됨.
    바로 위 코드에서는 두가지 경우로 인해 빈 값이 생길 수 있음
    1. level1,level2,level3중 어떤 값이 null이 된 경우,
       예를 들면 선문대 인문관에서 location을 구했을 때 level2(아산시)만 나오고 나머지 level1과 level3의 값은 null이 됨
  2. 지번 명과 해당 지역명이 다를 경우, 서울의 망원1동,망원2동 등 마지막 지역구가 분할되어 있는 경우 맞는 값이 나오지 않게 됨.
  
     위의 상황(말고도 더 있을지도...)에 아래의 코드가 호출되어, 예비로 받은 point 변수와, csv파일의 모든 데이터를 비교하여, 가장 가까운 지역의 주소를 가져오게 됨.
    이럴 일이 자주 있진 않겠지만... 어쩌면 탕정면에 있으면서 더 가까운 지역의 값을 가져오게 될 수도 있음. but 문제 없음
   
   */
  if (typeof data !== "object") {
    var closestLocation = findClosestLocation(point, jsonData);

    data = closestLocation;
  }

  return data;
};

const getLevel1 = async () => {
  const csvData = await fetch(
    "https://sched-sense-server.vercel.app/location.csv"
  ).then((response) => response.text());
  const jsonData = await convertCSVToJSON(csvData);
  //todo 제거하기

  const uniqueValues = new Set();
  jsonData.forEach((row) => {
    uniqueValues.add(row.level1);
  });
};

export { getLocation };
