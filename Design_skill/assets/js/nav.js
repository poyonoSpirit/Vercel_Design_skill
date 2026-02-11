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
      "contact",
      "about",
      "noc-dx",
      "network",
      "cloud",
      "game",
      "physical-dx"
    ];

    for (const name of sections) {
      
      // ここがセクションHTMLが置いてあるパスぽよん
      const res = await fetch(`./sections/${name}/${name}.html`);

      if (!res.ok) {
        console.warn(`${name}.html が見つからないぽよん`);
        continue;
      }

      const html = await res.text();
      
      // ここで各セクションのHTMLにsectionタグを自動追記してくれるので、いちいちsection HTML側に紐付け情報をかかなくてOKぽよん✨
      const wrapper = document.createElement("section");
      wrapper.id = name;
      wrapper.innerHTML = `
        <div class="container">
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
