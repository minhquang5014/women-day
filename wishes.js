onload = () => {
  // Chuyển trang lời chúc
  const pages = [...document.querySelectorAll(".page")];
  const prevBtn = document.querySelector(".pager__btn--prev");
  const nextBtn = document.querySelector(".pager__btn--next");
  const dotsBox = document.querySelector(".pager__dots");
  const feelBtn = document.querySelector(".feel-btn");
  let current = 0;
  const seen = new Set();

  const dots = pages.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "pager__dot";
    dot.setAttribute("aria-label", "Trang " + (i + 1));
    dot.onclick = () => show(i);
    dotsBox.appendChild(dot);
    return dot;
  });

  const show = (i) => {
    if (i < 0 || i >= pages.length) return;
    pages[current].classList.remove("active");
    pages[i].style.setProperty("--from", i >= current ? "60px" : "-60px");
    pages[i].classList.add("active");
    dots[current].classList.remove("active");
    dots[i].classList.add("active");
    current = i;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
    // Xem đủ tất cả các trang mới hiện nút gửi cảm nghĩ
    seen.add(i);
    if (seen.size === pages.length) feelBtn.classList.add("show");
  };

  prevBtn.onclick = () => show(current - 1);
  nextBtn.onclick = () => show(current + 1);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Vuốt trái/phải trên điện thoại
  let touchX = null;
  document.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX));
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  show(0);
};
