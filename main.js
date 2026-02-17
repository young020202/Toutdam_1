const sizeForm = document.getElementById("sizeForm");
const petTypeInput = document.getElementById("petType");
const weightInput = document.getElementById("weight");
const backInput = document.getElementById("backLength");
const chestInput = document.getElementById("chest");
const neckInput = document.getElementById("neck");
const fitInput = document.getElementById("fit");
const resultText = document.getElementById("resultText");
const resultTips = document.getElementById("resultTips");

const sizeChart = {
  dog: [
    { size: "XS", weight: 2.5, back: 22, chest: 30, neck: 20 },
    { size: "S", weight: 4, back: 27, chest: 36, neck: 24 },
    { size: "M", weight: 7, back: 32, chest: 43, neck: 29 },
    { size: "L", weight: 11, back: 38, chest: 50, neck: 34 },
    { size: "XL", weight: 16, back: 45, chest: 58, neck: 39 },
    { size: "2XL", weight: 24, back: 53, chest: 68, neck: 45 },
  ],
  cat: [
    { size: "XS", weight: 2, back: 20, chest: 28, neck: 18 },
    { size: "S", weight: 3.5, back: 24, chest: 33, neck: 21 },
    { size: "M", weight: 5, back: 28, chest: 38, neck: 24 },
    { size: "L", weight: 6.5, back: 32, chest: 43, neck: 27 },
    { size: "XL", weight: 8, back: 36, chest: 48, neck: 30 },
  ],
};

function getIndexForValue(chart, key, value) {
  return chart.findIndex((row) => value <= row[key]);
}

function normalizeMeasureIndex(chart, index) {
  if (index < 0) {
    return chart.length - 1;
  }
  return index;
}

function clampSizeIndex(chart, index) {
  if (index < 0) {
    return 0;
  }
  if (index > chart.length - 1) {
    return chart.length - 1;
  }
  return index;
}

function getFitOffset(fit) {
  if (fit === "slim") {
    return -1;
  }
  if (fit === "roomy") {
    return 1;
  }
  return 0;
}

function recommendSize({ petType, weight, backLength, chest, neck, fit }) {
  const chart = sizeChart[petType];
  const indices = [
    getIndexForValue(chart, "weight", weight),
    getIndexForValue(chart, "back", backLength),
    getIndexForValue(chart, "chest", chest),
    getIndexForValue(chart, "neck", neck),
  ].map((idx) => normalizeMeasureIndex(chart, idx));

  const baseIndex = Math.max(...indices);
  const adjustedIndex = clampSizeIndex(chart, baseIndex + getFitOffset(fit));
  return chart[adjustedIndex];
}

function renderTips(measurements, size) {
  const tips = [
    `추천 사이즈 ${size.size} 기준 가슴둘레 허용값은 최대 ${size.chest}cm입니다.`,
    measurements.chest > size.chest - 2
      ? "가슴둘레가 상한에 가까워요. 신축성 없는 옷은 한 치수 크게 고려하세요."
      : "현재 측정값은 표준 핏 기준으로 안정적인 범위입니다.",
    measurements.backLength > size.back
      ? "등길이가 길어 배 부분이 짧을 수 있습니다. 롱핏 제품을 우선 확인하세요."
      : "등길이도 현재 사이즈 범위 안에 들어옵니다.",
  ];

  resultTips.innerHTML = "";
  tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    resultTips.appendChild(li);
  });
}

sizeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = {
    petType: petTypeInput.value,
    weight: Number(weightInput.value),
    backLength: Number(backInput.value),
    chest: Number(chestInput.value),
    neck: Number(neckInput.value),
    fit: fitInput.value,
  };

  const recommended = recommendSize(input);
  const petLabel = input.petType === "dog" ? "강아지" : "고양이";

  resultText.textContent = `${petLabel} 측정 기준 추천 사이즈는 ${recommended.size} 입니다. (기준: 체중 ${input.weight}kg / 등 ${input.backLength}cm / 가슴 ${input.chest}cm / 목 ${input.neck}cm)`;
  renderTips(input, recommended);
});
