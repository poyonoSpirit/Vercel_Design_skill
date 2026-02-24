document.addEventListener("DOMContentLoaded", async () => {

  /* =========================
     1️⃣ nav.html を差し込む
  ========================== */

  async function loadNav() {
    const slot = document.getElementById("nav-slot");
    if (!slot) return;

    const res = await fetch("./partials/nav.html");
    if (!res.ok) {
      console.error("nav.html の読み込み失敗ぽよん");
      return;
    }

    slot.innerHTML = await res.text();
  }


  /* =========================
     2️⃣ sections を差し込む
  ========================== */

  async function loadSections() {
    const slot = document.getElementById("sections-slot");
    if (!slot) return;

    // 🔧 ここに追加していけば増殖できるぽよん
    const sections = [
      "hero",
      "vision",
      "approach",
      "skills",
      "about",
      "future",
    ];

    for (const name of sections) {
      
      // ここがセクションHTMLが置いてあるパスぽよん
      const res = await fetch(`./sections/${name}/${name}.html`);

      if (!res.ok) {
        console.warn(`${name}.html が見つからないぽよん`);
        continue;
      }

      const html = await res.text();
      
      /*ここで各セクションのHTMLにsectionタグを自動追記してくれるので、いちいちsection HTML側に紐付け情報をかかなくてOKぽよん✨
      visionセクションのときの例)
      
      <section id="vision" class="p-section">
        <div class="inner">

          <!-- ⭐️ここに sections/vision/vision.html の中身が入る -->

        </div>
      </section>
      */
      const wrapper = document.createElement("section");
      wrapper.id = name;
      wrapper.className = "p-section";

      wrapper.innerHTML = `
        <div class="inner">
          ${html}
        </div>
      `;

      slot.appendChild(wrapper);
    }
  }


  /* =========================
     実行
  ========================== */

  await loadNav();
  await loadSections();

});
