const filterButtons = document.querySelectorAll(".filter-button");
const patternCards = document.querySelectorAll(".pattern-card");
const backToTopButton = document.querySelector(".back-to-top");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { filter } = button.dataset;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    patternCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

window.addEventListener("scroll", () => {
  const shouldShow = window.scrollY > 500;
  backToTopButton.classList.toggle("is-visible", shouldShow);
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
