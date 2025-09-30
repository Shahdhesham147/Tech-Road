
const input = document.querySelector("#tagsInput input");
const tagsInput = document.getElementById("tagsInput");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && input.value.trim() !== "") {
    event.preventDefault();

    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = `${input.value} <span>&times;</span>`;

    tag.querySelector("span").addEventListener("click", function () {
      tag.remove();
    });

    tagsInput.insertBefore(tag, input);
    input.value = "";
  }
});