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
const downloadProfileCardBtn = document.getElementById("downloadProfileCardBtn");

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

function drawHeartPath(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x + w * 0.5, y + h);
  ctx.bezierCurveTo(x + w * 0.08, y + h * 0.76, x - w * 0.02, y + h * 0.44, x + w * 0.23, y + h * 0.24);
  ctx.bezierCurveTo(x + w * 0.23, y + h * 0.02, x + w * 0.45, y + h * 0.02, x + w * 0.5, y + h * 0.21);
  ctx.bezierCurveTo(x + w * 0.55, y + h * 0.02, x + w * 0.77, y + h * 0.02, x + w * 0.77, y + h * 0.24);
  ctx.bezierCurveTo(x + w * 1.02, y + h * 0.44, x + w * 0.92, y + h * 0.76, x + w * 0.5, y + h);
  ctx.closePath();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCoverImage(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width || 1;
  const ih = img.naturalHeight || img.height || 1;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function downloadProfileCardImage() {
  if (!latestRecommendation || !petProfileImage.src) {
    alert("먼저 카드를 만들어주세요.");
    return;
  }

  if (!(petProfileImage.complete && petProfileImage.naturalWidth > 0)) {
    alert("사진을 불러오지 못했어요. 다시 시도해 주세요.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#fff7fb");
  bg.addColorStop(1, "#ffeef6");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#f4d5e3";
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 60, 60, 960, 1280, 40);
  ctx.fill();
  ctx.stroke();

  const frameX = 190;
  const frameY = 130;
  const frameW = 700;
  const frameH = 640;

  const frameGrad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
  frameGrad.addColorStop(0, "#ff9ec4");
  frameGrad.addColorStop(1, "#ff74ab");
  ctx.fillStyle = frameGrad;
  drawHeartPath(ctx, frameX, frameY, frameW, frameH);
  ctx.fill();

  const inset = 26;
  const innerX = frameX + inset;
  const innerY = frameY + inset;
  const innerW = frameW - inset * 2;
  const innerH = frameH - inset * 2;

  ctx.save();
  drawHeartPath(ctx, innerX, innerY, innerW, innerH);
  ctx.clip();
  drawCoverImage(ctx, petProfileImage, innerX, innerY, innerW, innerH);
  ctx.restore();

  ctx.fillStyle = "#d43478";
  ctx.font = "700 56px Pretendard, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(petProfileTitle.textContent || "사랑하는 뚜다미, 아이이름", canvas.width / 2, 820);

  ctx.fillStyle = "#5b3045";
  ctx.font = "500 40px Pretendard, sans-serif";
  const infoLine = `${formatMeasure(latestRecommendation.weight)}kg/가슴둘레${formatMeasure(latestRecommendation.chest)}cm/목둘레${formatMeasure(latestRecommendation.neck)}cm/등길이${formatMeasure(latestRecommendation.backLength)}cm`;
  const sizeLine = `${latestRecommendation.size}사이즈 착용`;
  ctx.fillText(infoLine, canvas.width / 2, 910);
  ctx.fillText(sizeLine, canvas.width / 2, 980);

  canvas.toBlob((blob) => {
    if (!blob) {
      alert("카드 저장에 실패했어요. 다시 시도해 주세요.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      alert("새 탭에서 이미지를 길게 눌러 저장해 주세요.");
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = `toutdam-profile-card-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
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
    `등길이${formatMeasure(latestRecommendation.backLength)}cm\n` +
    `${latestRecommendation.size}사이즈 착용`;
  petProfileCard.hidden = false;
});

downloadProfileCardBtn.addEventListener("click", downloadProfileCardImage);

toggleChartImageBtn.addEventListener("click", toggleChartImage);

buildSizeChartTable();
buildNotices();
setupChartImage();
