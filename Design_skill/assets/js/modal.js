// ドキュメント全体でクリックを監視（イベント委譲）
document.addEventListener("click", async (e) => {

  // .modal-trigger が押されたかチェック
  const trigger = e.target.closest(".modal-trigger");
  if (!trigger) return; // 違ったら何もしない

  // data-modal="contact" みたいな値を取得
  const name = trigger.dataset.modal;

  // 対応する modal HTML を読み込む
  const res = await fetch(`./sections/${name}/${name}-modal.html`);
  if (!res.ok) return;

  const html = await res.text();

  // モーダルの背景（黒い半透明レイヤー）を作成
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // モーダル本体を挿入
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close">×</button>
      ${html}
    </div>
  `;

  // body に追加（画面に出す）
  document.body.appendChild(overlay);

  // モーダル開いたらスクロール禁止
  document.body.classList.add("is-modal-open");


  // 次フレームで .is-open を付与（アニメーション発火用）
  requestAnimationFrame(() => {
    overlay.classList.add("is-open");
  });

  // クリックで閉じる処理
  overlay.addEventListener("click", (ev) => {

    // 背景 or ×ボタンを押したら閉じる
    if (
      ev.target.classList.contains("modal-overlay") ||
      ev.target.classList.contains("modal-close")
    ) {

      overlay.classList.remove("is-open");

      // アニメーション後に削除
      setTimeout(() => overlay.remove(), 300);
    }


    overlay.classList.remove("is-open");
    // スクロール再開
    document.body.classList.remove("is-modal-open");
    setTimeout(() => overlay.remove(), 300);

  });

});
