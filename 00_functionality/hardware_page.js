document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".category-btn");
  const projects = document.querySelectorAll(".project");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      projects.forEach((project) => {
        if (
          project.getAttribute("data-category") === category ||
          category === "all"
        ) {
          project.style.display = "block";
        } else {
          project.style.display = "none";
        }
      });
    });
  });
});
