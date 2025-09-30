const ai = document.querySelector(".AI");

window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  ai.style.top = `${scrollY + 20}px`; 
});
