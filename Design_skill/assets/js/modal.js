(() => {
  const OPEN_CLASS = "is-open";
  const BODY_LOCK_CLASS = "is-modal-open";

  console.log("[modal.js] loaded ✅");

  const getModalById = (id) => document.getElementById(id);

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add(OPEN_CLASS);
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add(BODY_LOCK_CLASS);
    console.log("[modal.js] open:", modal.id);
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove(OPEN_CLASS);
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove(BODY_LOCK_CLASS);
    console.log("[modal.js] close:", modal.id);
  };

  const toggleModal = (modal) => {
    if (!modal) return;
    const nowOpen = modal.classList.contains(OPEN_CLASS);
    console.log("[modal.js] toggle ->", nowOpen ? "close" : "open", modal.id);
    nowOpen ? closeModal(modal) : openModal(modal);
  };

  // クリック捕捉（最重要）
  document.addEventListener("click", (e) => {
    console.log("[modal.js] click target:", e.target);

    const trigger = e.target.closest("[data-modal-target]");
    console.log("[modal.js] trigger:", trigger);

    if (!trigger) return;

    const id = trigger.getAttribute("data-modal-target");
    console.log("[modal.js] data-modal-target:", id);

    const modal = getModalById(id);
    console.log("[modal.js] modal element:", modal);

    if (!modal) {
      console.warn("[modal.js] modal not found. id=", id);
      return;
    }

    toggleModal(modal);
  });


  // どこをクリックしても閉じる（モーダル内クリックで閉じる）
document.addEventListener("click", (e) => {
  const modal = e.target.closest(".poyon-modal");
  if (!modal) return;
  if (!modal.classList.contains("is-open")) return;

  closeModal(modal);
});

  // Esc閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const modal = document.querySelector(`.poyon-modal.${OPEN_CLASS}`);
    closeModal(modal);
  });
})();