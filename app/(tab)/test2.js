import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calender } from "../../component";
import { config, db } from "../../config/firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore/lite";
import { router } from "expo-router";
import { insertWeatherData } from "../../db";
import uploadDbFile from "../../db/test";

export default function App() {
  useEffect(() => {
    insertWeatherData();
  }, []);

  const handleDateClick = async (selectedDate) => {
    console.log("선택된 날짜:", selectedDate);
    // 여기서 추가 작업 수행
    const a = collection(db, "AA");
    await setDoc(doc(db, "cities", "la"), {
      name: "LA",
      state: "CA",
      country: "USA",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#FF00FF" }}></View>
      <TouchableOpacity onPress={uploadDbFile}>
        <Text>버튼... 누르면 db송출</Text>
      </TouchableOpacity>
    </View>
  );
}
