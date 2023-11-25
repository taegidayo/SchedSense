function getSecondsUntilTargetTime(hour, minute) {
  // 현재 날짜와 시간을 가져옴
  const now = new Date();

  // 같은 날의 타겟 시간을 설정 (예: 21시 40분)
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );

  // 만약 현재 시간이 타겟 시간을 지났다면, 타겟을 다음 날로 설정
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  // 타겟 시간까지 남은 밀리초를 계산하고 초 단위로 변환
  const diff = target - now;
  return Math.round(diff / 1000);
}

export { getSecondsUntilTargetTime };
