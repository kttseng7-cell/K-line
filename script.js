const filterButtons = document.querySelectorAll(".filter-button");
const patternCards = document.querySelectorAll(".pattern-card");
const patternVisuals = document.querySelectorAll(".pattern-visual");
const anatomyMount = document.querySelector("#candle-anatomy");
const backToTopButton = document.querySelector(".back-to-top");

const patternCharts = {
  hammer: {
    tag: "低檔止跌",
    note: "主角是長下影，代表低檔承接。",
    candles: [
      { open: 76, close: 63, high: 81, low: 58, tone: "bear", muted: true },
      { open: 59, close: 55, high: 61, low: 15, tone: "bull", focus: true },
      { open: 54, close: 70, high: 74, low: 50, tone: "bull" }
    ]
  },
  "hanging-man": {
    tag: "高檔轉弱",
    note: "外型像鎚頭，但位置在高檔。",
    candles: [
      { open: 30, close: 45, high: 51, low: 25, tone: "bull", muted: true },
      { open: 47, close: 44, high: 50, low: 16, tone: "bear", focus: true },
      { open: 43, close: 31, high: 46, low: 27, tone: "bear" }
    ]
  },
  "shooting-star": {
    tag: "上攻失敗",
    note: "長上影代表高位賣壓很重。",
    candles: [
      { open: 31, close: 47, high: 54, low: 27, tone: "bull", muted: true },
      { open: 49, close: 44, high: 88, low: 41, tone: "bear", focus: true },
      { open: 42, close: 30, high: 46, low: 24, tone: "bear" }
    ]
  },
  doji: {
    tag: "多空僵持",
    note: "開收幾乎重疊，要等後面確認方向。",
    candles: [
      { open: 68, close: 52, high: 72, low: 47, tone: "bear", muted: true },
      { open: 48, close: 49, high: 71, low: 24, tone: "neutral", focus: true },
      { open: 48, close: 64, high: 68, low: 43, tone: "bull" }
    ]
  },
  "bullish-engulfing": {
    tag: "紅 K 吞沒黑 K",
    note: "第二根實體大到把前一根包住。",
    candles: [
      { open: 73, close: 51, high: 76, low: 46, tone: "bear", focus: true },
      { open: 45, close: 80, high: 84, low: 40, tone: "bull", focus: true }
    ]
  },
  "bearish-engulfing": {
    tag: "黑 K 吞沒紅 K",
    note: "高檔翻空時，第二根常明顯更大。",
    candles: [
      { open: 34, close: 58, high: 62, low: 29, tone: "bull", focus: true },
      { open: 64, close: 27, high: 68, low: 22, tone: "bear", focus: true }
    ]
  },
  harami: {
    tag: "大 K 包小 K",
    note: "第二根縮進第一根體內，代表動能放慢。",
    candles: [
      { open: 78, close: 28, high: 82, low: 21, tone: "bear", focus: true },
      { open: 48, close: 56, high: 61, low: 42, tone: "bull", focus: true }
    ]
  },
  piercing: {
    tag: "跌深回補",
    note: "第二根收回前黑 K 一半以上。",
    candles: [
      { open: 80, close: 34, high: 84, low: 28, tone: "bear", focus: true },
      { open: 24, close: 60, high: 66, low: 20, tone: "bull", focus: true }
    ]
  },
  "morning-star": {
    tag: "晨星止跌",
    note: "黑 K 後接小實體，再由紅 K 翻轉。",
    candles: [
      { open: 81, close: 33, high: 84, low: 27, tone: "bear", focus: true },
      { open: 28, close: 32, high: 39, low: 21, tone: "neutral", focus: true },
      { open: 36, close: 74, high: 78, low: 33, tone: "bull", focus: true }
    ]
  },
  "evening-star": {
    tag: "暮星轉空",
    note: "紅 K 後接小實體，再由黑 K 反壓。",
    candles: [
      { open: 24, close: 76, high: 81, low: 20, tone: "bull", focus: true },
      { open: 72, close: 69, high: 84, low: 64, tone: "neutral", focus: true },
      { open: 66, close: 28, high: 70, low: 24, tone: "bear", focus: true }
    ]
  },
  "three-white-soldiers": {
    tag: "三根連續推進",
    note: "紅 K 一根比一根高，買方節奏完整。",
    candles: [
      { open: 30, close: 53, high: 58, low: 24, tone: "bull", focus: true },
      { open: 41, close: 68, high: 72, low: 37, tone: "bull", focus: true },
      { open: 57, close: 82, high: 86, low: 52, tone: "bull", focus: true }
    ]
  },
  "three-black-crows": {
    tag: "三根連續下壓",
    note: "黑 K 一根比一根低，空方接手明確。",
    candles: [
      { open: 78, close: 55, high: 82, low: 49, tone: "bear", focus: true },
      { open: 67, close: 39, high: 70, low: 34, tone: "bear", focus: true },
      { open: 50, close: 23, high: 54, low: 18, tone: "bear", focus: true }
    ]
  }
};

const toneStyles = {
  bull: { fill: "#42d79a", stroke: "#9ef2c9" },
  bear: { fill: "#ea755f", stroke: "#ffc0ad" },
  neutral: { fill: "#dfcfb0", stroke: "#f6ead2" }
};

function priceToY(price) {
  const chartTop = 18;
  const chartBottom = 124;
  return chartBottom - (price / 100) * (chartBottom - chartTop);
}

function renderGrid(width = 320) {
  return [36, 70, 104]
    .map(
      (y) =>
        `<line x1="10" y1="${y}" x2="${width - 10}" y2="${y}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="4 6" />`
    )
    .join("");
}

function renderCandle(candle, index, total, filterId) {
  const styles = toneStyles[candle.tone];
  const step = total === 1 ? 0 : 240 / Math.max(total - 1, 1);
  const x = 40 + index * step;
  const openY = priceToY(candle.open);
  const closeY = priceToY(candle.close);
  const highY = priceToY(candle.high);
  const lowY = priceToY(candle.low);
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(10, Math.abs(openY - closeY));
  const opacity = candle.muted ? 0.38 : 1;
  const glow = candle.focus ? `filter="url(#${filterId})"` : "";

  return `
    <g transform="translate(${x},0)" opacity="${opacity}">
      <line x1="0" y1="${highY}" x2="0" y2="${lowY}" stroke="${styles.stroke}" stroke-width="${candle.focus ? 3 : 2}" />
      <rect
        x="-16"
        y="${bodyTop}"
        width="32"
        height="${bodyHeight}"
        rx="8"
        fill="${styles.fill}"
        ${glow}
      />
    </g>
  `;
}

function buildPatternSvg(pattern, key) {
  const candles = pattern.candles.map((candle, index) =>
    renderCandle(candle, index, pattern.candles.length, `glow-${key}`)
  );
  const filterId = `glow-${key}`;

  return `
    <svg viewBox="0 0 320 190" role="img" aria-label="${pattern.tag}">
      <defs>
        <filter id="${filterId}" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="rgba(255,255,255,0.14)" />
        </filter>
      </defs>
      <rect x="0" y="0" width="320" height="190" rx="18" fill="transparent" />
      ${renderGrid()}
      <text x="18" y="22" fill="#f7d49e" font-size="13" font-weight="700" letter-spacing="1.4">${pattern.tag}</text>
      ${candles.join("")}
      <text x="18" y="164" fill="rgba(243,239,231,0.82)" font-size="13">${pattern.note}</text>
    </svg>
  `;
}

function buildAnatomySvg() {
  return `
    <svg viewBox="0 0 420 220" role="img" aria-label="K線構造示意圖">
      <rect x="0" y="0" width="420" height="220" rx="18" fill="transparent" />
      <line x1="120" y1="26" x2="120" y2="176" stroke="#9ef2c9" stroke-width="4" />
      <rect x="92" y="72" width="56" height="56" rx="12" fill="#42d79a" />
      <line x1="280" y1="22" x2="280" y2="182" stroke="#ffc0ad" stroke-width="4" />
      <rect x="252" y="58" width="56" height="74" rx="12" fill="#ea755f" />
      <path d="M120 26 L136 26" stroke="#f2cf97" stroke-width="2" />
      <path d="M120 176 L136 176" stroke="#f2cf97" stroke-width="2" />
      <path d="M148 72 L178 72" stroke="#f2cf97" stroke-width="2" />
      <path d="M148 128 L178 128" stroke="#f2cf97" stroke-width="2" />
      <text x="184" y="30" fill="#f2cf97" font-size="14">最高價</text>
      <text x="184" y="76" fill="#f2cf97" font-size="14">開盤 / 收盤</text>
      <text x="184" y="132" fill="#f2cf97" font-size="14">收盤 / 開盤</text>
      <text x="184" y="180" fill="#f2cf97" font-size="14">最低價</text>
      <text x="80" y="204" fill="rgba(243,239,231,0.92)" font-size="14">紅 K：收盤高於開盤</text>
      <text x="242" y="204" fill="rgba(243,239,231,0.92)" font-size="14">綠 K：收盤低於開盤</text>
    </svg>
  `;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { filter } = button.dataset;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    patternCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

patternVisuals.forEach((visual) => {
  const card = visual.closest(".pattern-card");
  const key = card.dataset.pattern;
  const pattern = patternCharts[key];

  if (pattern) {
    visual.innerHTML = buildPatternSvg(pattern, key);
  }
});

if (anatomyMount) {
  anatomyMount.innerHTML = buildAnatomySvg();
}

window.addEventListener("scroll", () => {
  const shouldShow = window.scrollY > 500;
  backToTopButton.classList.toggle("is-visible", shouldShow);
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
