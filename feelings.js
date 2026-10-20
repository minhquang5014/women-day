// Gửi cảm nghĩ về email qua FormSubmit (không cần server)
const FEELINGS_EMAIL = "minhquang5014@gmail.com";

addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".feel-form");
  const status = document.querySelector(".feel-form__status");
  const submit = document.querySelector(".feel-form__submit");
  const thanks = document.querySelector(".thanks");

  form.addEventListener("submit", async (e) => {
    // Gửi ngầm để không phải tải lại trang, nhạc vẫn chạy tiếp
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    submit.disabled = true;
    submit.textContent = "Đang gửi... ✈️";
    status.textContent = "";

    try {
      const res = await fetch("https://formsubmit.co/ajax/" + FEELINGS_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Tên": data.name,
          "Cảm xúc": data.mood,
          "Cảm nghĩ": data.message,
          _subject: "💌 Cảm nghĩ 20/10 từ " + data.name,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json();
      if (!res.ok || json.success === "false" || json.success === false) throw new Error(json.message);

      form.style.display = "none";
      thanks.classList.add("show");
    } catch {
      status.textContent = "Gửi chưa được rồi 😢 Thử lại sau chút nha!";
      submit.disabled = false;
      submit.textContent = "Gửi đi 🚀";
    }
  });
});
