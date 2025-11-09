// hamburger menu
const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

// Form
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show success message
  successMessage.classList.add("show");

  // Reset form
  form.reset();

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 5000);
});
