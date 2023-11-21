import * as FileSystem from "expo-file-system";

const uploadDbFile = async () => {
  // SQLite 데이터베이스 파일 이름
  const dbName = "db.db";

  // 파일의 전체 경로 계산
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  console.log("DB File Path: ", dbFilePath);

  const uploadUrl = "http://192.168.1.7:5000"; // 서버 업로드 URL

  let uploadResponse = await FileSystem.uploadAsync(uploadUrl, dbFilePath);
  console.log("Upload response: ", uploadResponse);
};

export default uploadDbFile;
