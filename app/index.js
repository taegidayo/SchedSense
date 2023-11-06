import { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Calender } from "../component";
import { config, db } from "../config/firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore/lite";

export default function App() {
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
      <Calender onDateClick={handleDateClick} />
    </View>
  );
}
