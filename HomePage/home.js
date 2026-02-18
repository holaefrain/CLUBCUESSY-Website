const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

// Guard against missing .articles element (not present on home page)
const section = document.querySelector(".articles");
if (section) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      entries[0].target.classList.add("show");
    } else {
      entries[0].target.classList.remove("show");
    }
  }, {});
  observer.observe(section);
}


