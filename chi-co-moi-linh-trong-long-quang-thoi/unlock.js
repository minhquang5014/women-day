// Mở quà của Linh: dữ liệu trên GitHub đã mã hóa, chỉ giải được khi nhập đúng mật khẩu
// (khớp với tools/encrypt-linh.py)
const ITERATIONS = 250000;

async function decrypt(password, bytes) {
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, bytes.slice(28));
}

const toBlobUrl = ({ type, data }) =>
  URL.createObjectURL(new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], { type }));

addEventListener("DOMContentLoaded", () => {
  const gift = document.querySelector(".gift");
  const form = document.querySelector(".lock");
  const input = document.querySelector(".lock__input");
  const button = document.querySelector(".lock__btn");
  const msg = document.querySelector(".lock__msg");
  const frame = document.querySelector(".frame");
  const data = fetch("data.enc").then((res) => res.arrayBuffer()).then((buf) => new Uint8Array(buf));

  input.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = "Đang mở...";
    msg.textContent = "";

    try {
      const plain = await decrypt(input.value, await data);
      const { wishes, photos } = JSON.parse(new TextDecoder().decode(plain));
      // Các trang bên trong khung đọc lời chúc và ảnh từ đây
      window.linh = { wishes, photos: photos.map(toBlobUrl) };

      const page = new URLSearchParams(location.search).get("page");
      frame.src = /^[\w-]+\.html$/.test(page) && page !== "index.html" ? page : "flowers.html";
      gift.classList.add("gift--open");
      setTimeout(() => gift.remove(), 800);
    } catch {
      msg.textContent = "Sai mật khẩu rồi nè 😝";
      form.classList.remove("lock--shake");
      void form.offsetWidth;
      form.classList.add("lock--shake");
      button.disabled = false;
      button.textContent = "Mở quà 🎁";
      input.select();
    }
  });
});
