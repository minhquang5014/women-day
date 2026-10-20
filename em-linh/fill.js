// Điền lời chúc và ảnh (đã giải mã ở trang ngoài) vào các trang, chia đều ảnh cho từng trang
addEventListener("DOMContentLoaded", () => {
  const data = window.parent !== window && window.parent.linh;
  if (!data) return;

  const pages = document.querySelectorAll(".page");
  const perPage = Math.ceil(data.photos.length / pages.length);

  pages.forEach((page, i) => {
    page.querySelector(".wish").textContent = data.wishes[i] || "";
    const box = page.querySelector(".photos");
    data.photos.slice(i * perPage, (i + 1) * perPage).forEach((src) => {
      const photo = document.createElement("button");
      photo.className = "photo";
      photo.innerHTML = `<img alt="Ảnh của Linh">`;
      photo.firstChild.src = src;
      photo.onclick = () => open(src);
      box.appendChild(photo);
    });
  });

  // Bấm vào ảnh để xem to
  const lightbox = document.querySelector(".lightbox");
  const open = (src) => {
    lightbox.firstChild.src = src;
    lightbox.classList.add("show");
  };
  lightbox.onclick = () => lightbox.classList.remove("show");
});
