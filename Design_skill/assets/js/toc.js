const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".toc a");


// ハイライトしたいセクションが画面中央にきたら、該当セクションに"active"クラスをつけるぽよん
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    threshold: 0.6
  }
);

sections.forEach(section => {
  observer.observe(section);
});