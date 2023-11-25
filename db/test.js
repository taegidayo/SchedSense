import * as FileSystem from "expo-file-system";

const uploadDbFile = async () => {
  // SQLite 데이터베이스 파일 이름
  const dbName = "db.db";

  // 파일의 전체 경로 계산
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  //   try {
  //     const files = await FileSystem.readDirectoryAsync(
  //       `${FileSystem.documentDirectory}SQLite`
  //     );
  //     console.log("Directory contents:", files);
  //   } catch (error) {
  //     console.error("Error reading directory:", error);
  //   }

  console.log("DB File Path: ", dbFilePath);

  const uploadUrl = "http://exp://192.168.1.7:5000/upload"; // 서버 업로드 URL

  let uploadResponse = await FileSystem.uploadAsync(uploadUrl, dbFilePath, {
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: "file",
    mimeType: "application/x-sqlite3", // SQLite DB 파일의 MIME 타입
    parameters: {
      filename: "db.db", // 파일 이름
    },
  });
  console.log("Upload response: ", uploadResponse);
};

export default uploadDbFile;
