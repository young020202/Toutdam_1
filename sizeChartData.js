window.SIZE_CHART_DATA = {
  imageUrl: "https://www.genspark.ai/api/files/s/04Qp2yQn",
  // 2안(권장): 이미지 파일을 프로젝트 정적 경로에 둘 경우 값만 교체
  // 예: "/assets/dog-size-chart.jpg"
  localImageUrl: "",
  columns: ["S", "M", "L", "XL", "2XL"],
  rows: [
    { label: "가슴둘레(cm)", values: { S: "34", M: "38", L: "42", XL: "46", "2XL": "50" } },
    { label: "등길이(cm)", values: { S: "23.5", M: "27", L: "30", XL: "33", "2XL": "36" } },
    { label: "목둘레(cm)", values: { S: "17", M: "19", L: "21", XL: "23", "2XL": "25" } },
    { label: "추천 몸무게(kg)", values: { S: "~2.5kg", M: "~3.5kg", L: "~5kg", XL: "~7.5kg", "2XL": "~10kg" } },
  ],
  averageNotice: "※ 위 사이즈표는 평균값이며, 옷마다 실측 사이즈가 다를 수 있습니다.",
  notices: [
    "※ 사이즈는 측정 환경에 따라 2-3cm 오차가 있을 수 있습니다.",
    "※ 사이즈가 고민되시면 고객센터로 문의해주시면 상담 도와드리겠습니다.",
  ],
  // 경계값은 상위 사이즈로 올림한다.
  // 예: 2.5kg 정확히 입력 시 S가 아닌 M을 추천한다.
  weightRules: [
    { minInclusive: 0, maxExclusive: 2.5, size: "S" },
    { minInclusive: 2.5, maxExclusive: 3.5, size: "M" },
    { minInclusive: 3.5, maxExclusive: 5, size: "L" },
    { minInclusive: 5, maxExclusive: 7.5, size: "XL" },
    { minInclusive: 7.5, maxInclusive: 10, size: "2XL" },
  ],
};
