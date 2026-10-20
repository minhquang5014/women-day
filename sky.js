// Đốm sáng bay lên giống trang hoa
addEventListener("DOMContentLoaded", () => {
  const sky = document.querySelector(".sky");
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement("span");
    const size = 3 + Math.random() * 5;
    dot.style.left = Math.random() * 100 + "vw";
    dot.style.width = dot.style.height = size + "px";
    dot.style.animationDuration = 8 + Math.random() * 10 + "s";
    dot.style.animationDelay = -Math.random() * 18 + "s";
    sky.appendChild(dot);
  }
});
