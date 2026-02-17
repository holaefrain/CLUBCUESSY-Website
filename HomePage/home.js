const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

const section = document.querySelector(".articles");
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    entries[0].target.classList.add(".articles.show");
  } else {
    entries[0].target.classList.remove(".articles.show");
  }
}, {});
observer.observe(section);


