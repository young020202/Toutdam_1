window.SIZE_CHART_DATA = {
  imageUrl: "https://www.genspark.ai/api/files/s/p2j9cv0p",
  // 2안(권장): 이미지 파일을 프로젝트 정적 경로에 둘 경우 값만 교체
  // 예: "/assets/dog-size-chart.jpg"
  localImageUrl: "",
  columns: ["S", "M", "L", "XL", "2XL"],
  rows: [
    { label: "가슴둘레(cm)", values: { S: "30", M: "34", L: "38", XL: "44", "2XL": "-" } },
    { label: "등길이(cm)", values: { S: "23", M: "26", L: "29", XL: "31", "2XL": "-" } },
    { label: "목둘레(cm)", values: { S: "22", M: "24", L: "28", XL: "30", "2XL": "-" } },
    { label: "추천 몸무게", values: { S: "~2.5kg", M: "~3.5kg", L: "~5kg", XL: "~7.5kg", "2XL": "-" } },
  ],
  notices: [
    "*사이즈는 측정 환경에 따라 2-3cm 오차가 있을 수 있습니다.",
    "*사이즈가 고민 되시는 분들은 네이버 톡톡 & 카카오톡 채널로 문의주세요!",
  ],
  weightRules: [
    // 경계값 규칙: 정확히 경계값이면 해당 상한 구간에 포함
    // 예: 2.5kg -> S, 3.5kg -> M, 5kg -> L, 7.5kg -> XL
    { minExclusive: 0, maxInclusive: 2.5, size: "S" },
    { minExclusive: 2.5, maxInclusive: 3.5, size: "M" },
    { minExclusive: 3.5, maxInclusive: 5, size: "L" },
    { minExclusive: 5, maxInclusive: 7.5, size: "XL" },
  ],
};
