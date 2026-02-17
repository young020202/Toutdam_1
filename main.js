const sizeForm = document.getElementById("sizeForm");
const petTypeInput = document.getElementById("petType");
const weightInput = document.getElementById("weight");
const backInput = document.getElementById("backLength");
const chestInput = document.getElementById("chest");
const neckInput = document.getElementById("neck");
const fitInput = document.getElementById("fit");
const resultText = document.getElementById("resultText");
const resultTips = document.getElementById("resultTips");

const sizeChartTable = document.getElementById("sizeChartTable");
const sizeChartNotices = document.getElementById("sizeChartNotices");
const sizeChartAverageNotice = document.getElementById("sizeChartAverageNotice");
const sizeChartImage = document.getElementById("sizeChartImage");
const sizeChartImageWrap = document.getElementById("sizeChartImageWrap");
const toggleChartImageBtn = document.getElementById("toggleChartImage");
const openProfileFormBtn = document.getElementById("openProfileFormBtn");
const profileFormWrap = document.getElementById("profileFormWrap");
const petNameInput = document.getElementById("petNameInput");
const petPhotoInput = document.getElementById("petPhotoInput");
const makeProfileCardBtn = document.getElementById("makeProfileCardBtn");
const petProfileCard = document.getElementById("petProfileCard");
const petProfileImage = document.getElementById("petProfileImage");
const petProfileTitle = document.getElementById("petProfileTitle");
const petProfileMeta = document.getElementById("petProfileMeta");

const chartData = window.SIZE_CHART_DATA;
let latestRecommendation = null;

function buildSizeChartTable() {
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  const headLabel = document.createElement("th");
  headLabel.scope = "col";
  headLabel.textContent = "측정 항목";
  headRow.appendChild(headLabel);

  chartData.columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column;
    headRow.appendChild(th);
  });
  head.appendChild(headRow);

  const body = document.createElement("tbody");
  chartData.rows.forEach((row) => {
    const tr = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.scope = "row";
    rowHeader.textContent = row.label;
    tr.appendChild(rowHeader);

    chartData.columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = row.values[column] || "-";
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });

  sizeChartTable.appendChild(head);
  sizeChartTable.appendChild(body);
}

function buildNotices() {
  sizeChartAverageNotice.textContent = chartData.averageNotice;

  chartData.notices.forEach((notice) => {
    const li = document.createElement("li");
    li.textContent = notice;
    sizeChartNotices.appendChild(li);
  });
}

function setupChartImage() {
  const imageSrc = chartData.localImageUrl || chartData.imageUrl;
  sizeChartImage.src = imageSrc;
}

function toggleChartImage() {
  const expanded = toggleChartImageBtn.getAttribute("aria-expanded") === "true";
  const next = !expanded;
  toggleChartImageBtn.setAttribute("aria-expanded", String(next));
  toggleChartImageBtn.textContent = next ? "이미지 숨기기" : "이미지로 보기";
  sizeChartImageWrap.hidden = !next;
}

function getWeightRecommendation(weight) {
  for (const rule of chartData.weightRules) {
    if (
      weight >= rule.minInclusive &&
      (rule.maxExclusive === undefined ? weight <= rule.maxInclusive : weight < rule.maxExclusive)
    ) {
      return { size: rule.size, inRange: true };
    }
  }
  return { size: null, inRange: false };
}

function renderTips(input, recommendation) {
  const tips = [];

  if (!recommendation.inRange) {
    tips.push("입력한 몸무게는 평균값 기준 구간 밖이라 추천이 애매할 수 있습니다.");
    tips.push("가슴둘레와 등길이를 함께 확인한 뒤 고객센터 문의를 권장합니다.");
  } else {
    tips.push(`추천 사이즈는 ${recommendation.size} 입니다. (몸무게 기준)`);
    tips.push(
      input.fit === "roomy"
        ? "여유핏 선택 시 한 단계 크게 느껴질 수 있어 실측값을 함께 확인하세요."
        : "기본/슬림핏은 가슴둘레 실측을 함께 확인하면 실패 확률이 줄어듭니다."
    );
  }

  if (input.chest >= 44 || input.backLength >= 31 || input.neck >= 30) {
    tips.push("실측값이 XL 기준에 근접합니다. 활동량이 많다면 신축성 있는 소재를 권장합니다.");
  }

  resultTips.innerHTML = "";
  tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    resultTips.appendChild(li);
  });
}

function formatMeasure(value) {
  const n = Number(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
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

  const recommendation = getWeightRecommendation(input.weight);
  const petLabel = input.petType === "dog" ? "강아지" : "고양이";

  if (!recommendation.inRange) {
    resultText.textContent = `${petLabel} 측정 기준 현재 입력 몸무게(${input.weight}kg)는 평균값 추천 범위(0~10kg) 밖입니다. 평균값 기준으로는 애매할 수 있어 문의를 권장합니다.`;
    latestRecommendation = null;
    openProfileFormBtn.disabled = true;
    profileFormWrap.hidden = true;
    petProfileCard.hidden = true;
  } else {
    resultText.textContent = `${petLabel} 측정 기준 추천 사이즈는 ${recommendation.size} 입니다. (기준: 체중 ${input.weight}kg / 등 ${input.backLength}cm / 가슴 ${input.chest}cm / 목 ${input.neck}cm)`;
    latestRecommendation = {
      weight: input.weight,
      chest: input.chest,
      neck: input.neck,
      backLength: input.backLength,
      size: recommendation.size,
    };
    openProfileFormBtn.disabled = false;
  }

  renderTips(input, recommendation);
});

openProfileFormBtn.addEventListener("click", () => {
  if (!latestRecommendation) return;
  profileFormWrap.hidden = !profileFormWrap.hidden;
});

makeProfileCardBtn.addEventListener("click", () => {
  if (!latestRecommendation) {
    alert("먼저 맞춤 사이즈 추천을 받아주세요.");
    return;
  }

  const imageFile = petPhotoInput.files?.[0];
  if (!imageFile) {
    alert("아이 사진을 넣어주세요.");
    return;
  }

  const petName = (petNameInput.value || "").trim() || "아이이름";
  const imageUrl = URL.createObjectURL(imageFile);

  petProfileImage.src = imageUrl;
  petProfileTitle.textContent = `사랑하는 뚜다미, ${petName}`;
  petProfileMeta.textContent =
    `${formatMeasure(latestRecommendation.weight)}kg/` +
    `가슴둘레${formatMeasure(latestRecommendation.chest)}cm/` +
    `목둘레${formatMeasure(latestRecommendation.neck)}cm/` +
    `등길이${formatMeasure(latestRecommendation.backLength)}cm/` +
    `${latestRecommendation.size}사이즈 착용`;
  petProfileCard.hidden = false;
});

toggleChartImageBtn.addEventListener("click", toggleChartImage);

buildSizeChartTable();
buildNotices();
setupChartImage();
