"""Mã hóa lời chúc và ảnh trong thư mục Linh/ thành em-linh/data.enc.

Chạy lại mỗi khi đổi ảnh hoặc lời chúc:
    python tools/encrypt-linh.py <mật khẩu>

Định dạng file: salt (16 byte) | iv (12 byte) | dữ liệu AES-256-GCM.
Khóa lấy từ mật khẩu bằng PBKDF2-SHA256, khớp với em-linh/unlock.js.
"""

import base64
import json
import os
import sys
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ITERATIONS = 250_000
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Linh"
OUT = ROOT / "em-linh" / "data.enc"
IMAGE_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 2:
        sys.exit("Cách dùng: python tools/encrypt-linh.py <mật khẩu>")
    password = sys.argv[1].encode()

    wishes = json.loads((SRC / "wishes.json").read_text(encoding="utf-8"))
    photos = [
        {"type": IMAGE_TYPES[f.suffix.lower()], "data": base64.b64encode(f.read_bytes()).decode()}
        for f in sorted(SRC.iterdir())
        if f.suffix.lower() in IMAGE_TYPES
    ]
    payload = json.dumps({"wishes": wishes, "photos": photos}, ensure_ascii=False).encode()

    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(hashes.SHA256(), 32, salt, ITERATIONS).derive(password)
    OUT.write_bytes(salt + iv + AESGCM(key).encrypt(iv, payload, None))
    print(f"Đã mã hóa {len(wishes)} lời chúc, {len(photos)} ảnh -> {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
