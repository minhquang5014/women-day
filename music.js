// Nhạc nền dùng chung cho các trang, phát tiếp khi chuyển trang

// Dán link YouTube hoặc link trực tiếp tới file .mp3 (hoặc "music.mp3" nếu dùng file trong thư mục)
const MUSIC_SRC = "until_I_found_you.mp3";

addEventListener("DOMContentLoaded", () => {
  // Trang đang nằm trong khung của index.html: nhạc do trang ngoài phát, ở đây chỉ báo lần bấm đầu tiên
  if (window.parent !== window) {
    const wake = () => {
      try {
        window.parent.startMusic();
      } catch {}
    };
    ["click", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, wake, { once: true }));
    return;
  }

  const get = (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const set = (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {}
  };

  const btn = document.createElement("button");
  btn.className = "music-btn";
  btn.setAttribute("aria-label", "Bật/tắt nhạc");
  btn.textContent = "🎵";
  document.body.appendChild(btn);

  // Trang nào cũng bật nhạc, nút 🎵 chỉ tạm dừng trên trang hiện tại
  let muted = false;
  const savedTime = parseFloat(get("music-time")) || 0;
  const render = (playing) => btn.classList.toggle("playing", playing);

  const youtubeId = (MUSIC_SRC.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1];
  const player = youtubeId ? createYouTubePlayer(youtubeId, savedTime, render) : createAudioPlayer(MUSIC_SRC, savedTime, render);

  const tryPlay = () => {
    if (!muted) player.play();
  };
  window.startMusic = tryPlay;

  // Trình duyệt chặn tự phát nhạc có tiếng, nên phát ngay ở lần chạm/bấm đầu tiên
  const unlock = (e) => {
    if (e.target === btn) return;
    tryPlay();
    ["click", "touchstart", "keydown"].forEach((ev) => removeEventListener(ev, unlock));
  };
  ["click", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, unlock));

  btn.onclick = () => {
    muted = player.isPlaying();
    muted ? player.pause() : player.play();
  };

  addEventListener("pagehide", () => set("music-time", player.time()));

  tryPlay();
});

function createAudioPlayer(src, startAt, onChange) {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.6;
  audio.currentTime = startAt;
  audio.addEventListener("play", () => onChange(true));
  audio.addEventListener("pause", () => onChange(false));
  // Hết bài thì phát lại từ đầu (phòng khi trình duyệt bỏ qua loop)
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  return {
    play: () => audio.play().catch(() => {}),
    pause: () => audio.pause(),
    isPlaying: () => !audio.paused,
    time: () => audio.currentTime,
  };
}

function createYouTubePlayer(videoId, startAt, onChange) {
  const holder = document.createElement("div");
  const wrap = document.createElement("div");
  wrap.className = "music-yt";
  wrap.appendChild(holder);
  document.body.appendChild(wrap);

  let yt = null;
  let ready = false;
  let wantPlay = false;
  let playing = false;

  window.onYouTubeIframeAPIReady = () => {
    yt = new YT.Player(holder, {
      videoId,
      width: 200,
      height: 200,
      playerVars: {
        controls: 0,
        playsinline: 1,
        loop: 1,
        playlist: videoId,
        start: Math.floor(startAt),
      },
      events: {
        onReady: () => {
          ready = true;
          yt.setVolume(60);
          if (wantPlay) yt.playVideo();
        },
        onStateChange: (e) => {
          playing = e.data === YT.PlayerState.PLAYING;
          onChange(playing);
          if (e.data === YT.PlayerState.ENDED) {
            yt.seekTo(0);
            yt.playVideo();
          }
        },
      },
    });
  };

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);

  return {
    play: () => {
      wantPlay = true;
      if (ready) yt.playVideo();
    },
    pause: () => {
      wantPlay = false;
      if (ready) yt.pauseVideo();
    },
    isPlaying: () => playing,
    time: () => (ready ? yt.getCurrentTime() : startAt),
  };
}
