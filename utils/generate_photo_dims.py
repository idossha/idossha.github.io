#!/usr/bin/env python3
"""
Generate a JSON map of image src -> (width, height) for the photo gallery.

Why: prevents layout shift/jitter by allowing the page to reserve the correct
aspect ratio before each image loads.

Outputs:
  - ../functionality/photo_dims.json

No third-party deps (parses JPEG/PNG headers directly).
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Dict, Tuple


def _png_size(path: Path) -> Tuple[int, int]:
    # PNG: width/height are 4-byte big-endian at IHDR chunk.
    with path.open("rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError("not a png")
        _len = f.read(4)
        chunk_type = f.read(4)
        if chunk_type != b"IHDR":
            raise ValueError("invalid png (missing IHDR)")
        w = int.from_bytes(f.read(4), "big")
        h = int.from_bytes(f.read(4), "big")
        return w, h


def _jpeg_size(path: Path) -> Tuple[int, int]:
    # JPEG: scan markers until SOF0/SOF2 (baseline/progressive) to read dims.
    with path.open("rb") as f:
        if f.read(2) != b"\xFF\xD8":
            raise ValueError("not a jpeg")

        while True:
            # Find next marker 0xFF??
            b = f.read(1)
            if not b:
                break
            if b != b"\xFF":
                continue

            # Skip fill bytes (0xFF)
            while True:
                marker = f.read(1)
                if not marker:
                    return None  # type: ignore[return-value]
                if marker != b"\xFF":
                    break

            m = marker[0]

            # Standalone markers without length
            if m in (0xD9, 0xDA):  # EOI, SOS -> stop
                break
            if 0xD0 <= m <= 0xD7:  # RST markers
                continue

            seg_len_bytes = f.read(2)
            if len(seg_len_bytes) != 2:
                break
            seg_len = int.from_bytes(seg_len_bytes, "big")
            if seg_len < 2:
                break

            # SOF markers that contain size
            if m in (0xC0, 0xC2):  # SOF0, SOF2
                _precision = f.read(1)
                h = int.from_bytes(f.read(2), "big")
                w = int.from_bytes(f.read(2), "big")
                return w, h

            # Skip segment payload (length includes the two length bytes)
            f.seek(seg_len - 2, os.SEEK_CUR)

    raise ValueError("jpeg size not found")


def image_size(path: Path) -> Tuple[int, int]:
    suffix = path.suffix.lower()
    if suffix == ".png":
        return _png_size(path)
    if suffix in (".jpg", ".jpeg"):
        return _jpeg_size(path)
    raise ValueError(f"unsupported image type: {suffix}")


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    html_path = repo_root / "Pages" / "photo_page.html"
    out_path = repo_root / "functionality" / "photo_dims.json"

    html = html_path.read_text(encoding="utf-8")

    # Match src attributes that point into ../assets/photos/...
    srcs = re.findall(r'<img[^>]+src="([^"]+)"', html, flags=re.IGNORECASE)
    srcs = [s for s in srcs if s.startswith("../assets/photos/")]

    dims: Dict[str, Tuple[int, int]] = {}
    missing = []

    for src in srcs:
        # Convert ../assets/... to filesystem path
        rel = src.replace("../", "")
        img_path = repo_root / rel
        if not img_path.exists():
            missing.append(src)
            continue
        try:
            w, h = image_size(img_path)
            dims[src] = (w, h)
        except Exception as e:
            print(f"warning: failed reading {src}: {e}")

    out_path.write_text(
        json.dumps(dims, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    print(f"Wrote {out_path} with {len(dims)} entries.")
    if missing:
        print(f"Missing {len(missing)} files referenced in HTML.")


if __name__ == "__main__":
    main()

