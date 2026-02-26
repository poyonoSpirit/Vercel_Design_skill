// assets/js/scroll.js
// approach セクションのカード横スクロール制御ぽよん
// - nav.js等でHTMLが後から差し込まれても動くようにイベント委譲で実装
// - 1クリックで「カード1枚分 + gap」だけスクロール
// - 端に到達したらボタンを薄くして「もう動かない」感を出す

(() => {
  // いまのDOMから scroll関連要素を探す
  function getParts() {
    const scrollContainer = document.querySelector(".approach-scroll");
    const track = document.querySelector(".approach-track");
    const leftBtn = document.querySelector(".scroll-left");
    const rightBtn = document.querySelector(".scroll-right");
    return { scrollContainer, track, leftBtn, rightBtn };
  }

  // カード1枚分 + gap のスクロール量を計算
  function getStep(scrollContainer, track) {
    const card = scrollContainer?.querySelector(".approach-card");
    if (!card) return Math.round((scrollContainer?.clientWidth || 300) * 0.8);

    let gap = 0;
    if (track) {
      const style = getComputedStyle(track);
      // gap が取れないブラウザもあるので保険ぽよん
      const parsed = parseInt(style.gap || style.columnGap || "0", 10);
      gap = Number.isFinite(parsed) ? parsed : 0;
    }
    return card.offsetWidth + gap;
  }

  // 端に来たらボタンを薄くする
  function updateButtons(scrollContainer, leftBtn, rightBtn) {
    if (!scrollContainer || !leftBtn || !rightBtn) return;

    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const x = scrollContainer.scrollLeft;

    const atLeft = x <= 1;
    const atRight = x >= maxScroll - 1;

    leftBtn.style.opacity = atLeft ? "0.25" : "1";
    rightBtn.style.opacity = atRight ? "0.25" : "1";

    leftBtn.style.pointerEvents = atLeft ? "none" : "auto";
    rightBtn.style.pointerEvents = atRight ? "none" : "auto";
  }

  // クリックはイベント委譲で拾う（後からDOMが追加されてもOK）
  document.addEventListener("click", (e) => {
    const right = e.target.closest(".scroll-right");
    const left = e.target.closest(".scroll-left");
    if (!right && !left) return;

    const { scrollContainer, track, leftBtn, rightBtn } = getParts();
    if (!scrollContainer) return;

    const step = getStep(scrollContainer, track);
    scrollContainer.scrollBy({
      left: right ? step : -step,
      behavior: "smooth",
    });

    // スクロール直後は値が変わる途中なので少し遅らせて更新ぽよん
    setTimeout(() => updateButtons(scrollContainer, leftBtn, rightBtn), 120);
  });

  // スクロール中もボタン状態を更新
  document.addEventListener(
    "scroll",
    () => {
      const { scrollContainer, leftBtn, rightBtn } = getParts();
      if (!scrollContainer) return;
      updateButtons(scrollContainer, leftBtn, rightBtn);
    },
    true // 子要素のスクロールも拾うぽよん
  );

  // 初期状態を整える（HTMLが後から入る場合もあるので監視）
  function tryInit() {
    const { scrollContainer, leftBtn, rightBtn } = getParts();
    if (!scrollContainer || !leftBtn || !rightBtn) return false;

    // 初期化済みなら何もしない
    if (scrollContainer.dataset.scrollInit === "1") return true;
    scrollContainer.dataset.scrollInit = "1";

    updateButtons(scrollContainer, leftBtn, rightBtn);
    return true;
  }

  if (!tryInit()) {
    const obs = new MutationObserver(() => {
      if (tryInit()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
})();