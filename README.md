# Expo Router Example

Use [`expo-router`](https://expo.github.io/router) to build native navigation using files in the `app/` directory.

## 🚀 How to use

```sh
npx create-expo-app -e with-router
```

## 📝 Notes

- [Expo Router: Docs](https://expo.github.io/router)
- [Expo Router: Repo](https://github.com/expo/router)

##단기예보 코드
| 예보구분코드 | 항목설명 | 단위 | 약칭bit수 |
|-------------|------------|----|---------|
| POP | 강수확률 | % | 8 |
| PTY | 강수형태 | 코드값 | 4 |
| PCP | 1시간 강수량 | 밀리 (1 mm)ㄹ | 8 |
| REH | 습도 | % | 8 |
| SNO | 1시간 신적설 | 밀리(1 cm)ㅂ | 8 |
| SKY | 하늘상태 | 코드값 | 4 |
| TMP | 1시간 기온 | ℃ | 10 |
| TMN | 일 최저기온 | ℃ | 10 |
| TMX | 일 최고기온 | ℃ | 10 |
| UUU | 풍속(동서성분) | m/s | 12 |
| VVV | 풍속(남북성분) | m/s | 12 |
| WAV | 파고 | M | 8 |
| VEC | 풍향 | deg | 10 |
| WSD | 풍속 | m/s | 10 |

| 범주                      | 문자열표시              |
| ------------------------- | ----------------------- |
| 0.1 ~ 1.0mm 미만          | 1.0mm 미만              |
| 1.0mm 이상 30.0mm 미만    | 실수값+mm(1.0mm~29.9mm) |
| 30.0 mm 이상 50.0 mm 미만 | 30.0~50.0mm             |
| 50.0 mm 이상              | 50.0mm 이상             |

단기예보 발표시각
Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)

- API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
