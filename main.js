onload = () => {
  const gift = document.querySelector(".gift");

  const start = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };

  // Đã mở quà rồi thì không hiện lại khi quay về từ trang lời chúc
  let opened = false;
  try {
    opened = sessionStorage.getItem("gift-opened") === "1";
  } catch {}

  // Không có hộp quà (trang của Linh mở quà ở trang ngoài) thì cho hoa nở luôn
  if (!gift || opened) {
    gift?.remove();
    start();
    return;
  }

  // Cú bấm mở quà cũng là lúc trình duyệt cho phép phát nhạc
  gift.onclick = () => {
    try {
      sessionStorage.setItem("gift-opened", "1");
    } catch {}
    gift.classList.add("gift--open");
    setTimeout(() => gift.remove(), 800);
    start();
  };
};
