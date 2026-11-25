"""
Hexora Labs — brand asset pipeline.

Reads the ORIGINAL logo files (left untouched in /brand-originals) and generates
web-optimised derivatives:

  src/assets/brand/logo-horizontal.webp   transparent horizontal lockup (nav, footer)
  src/assets/brand/logo-mark.webp         transparent icon mark
  src/assets/brand/logo-badge.webp        circular badge, transparent outside the ring
  public/favicon.ico, favicon-16/32.png, apple-touch-icon.png, icon-192/512.png
  public/og-image.jpg                     1200x630 Open Graph preview

Background removal uses a "colour-to-alpha" against white so anti-aliased edges
stay smooth, and keeps the intentional white face INSIDE the hexagon mark by
detecting the region enclosed by the navy outline.

Usage:  python scripts/process_assets.py
Requires: Pillow, numpy
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand-originals"
HORIZONTAL = SRC / "Hexora Labs Software Solutions Logo.png"
BADGE = SRC / "Hexora Labs Software Solutions Logo (1).png"
OUT_ASSETS = ROOT / "src" / "assets" / "brand"
OUT_PUBLIC = ROOT / "public"
DIVIDER_X = 690  # x-position (original px) between icon mark and wordmark

OUT_ASSETS.mkdir(parents=True, exist_ok=True)
OUT_PUBLIC.mkdir(parents=True, exist_ok=True)


def color_to_alpha(rgb: np.ndarray) -> np.ndarray:
    """Remove a white background; returns float RGBA in 0..1 (un-premultiplied)."""
    c = rgb.astype(np.float64) / 255.0
    # Treat near-white (paper noise) as pure white
    alpha = (1.0 - c).max(axis=2)
    alpha = np.clip((alpha - 0.025) / (1 - 0.025), 0, 1)
    a = alpha[..., None]
    with np.errstate(divide="ignore", invalid="ignore"):
        col = np.where(a > 0, (c - (1 - a)) / np.maximum(a, 1e-6), 0)
    col = np.clip(col, 0, 1)
    return np.concatenate([col, a], axis=2)


def hull_region(dark: np.ndarray) -> np.ndarray:
    """Convex hull of the `dark` (navy hexagon) pixels, as a boolean mask.

    The hexagon outline is intentionally open in places, so a flood fill can't
    find its white face; its convex hull matches how the mark reads on white.
    """
    ys, xs = np.where(dark)
    pts = sorted(set(zip(xs.tolist(), ys.tolist())))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    hull = lower[:-1] + upper[:-1]
    m = Image.new("L", (dark.shape[1], dark.shape[0]), 0)
    ImageDraw.Draw(m).polygon(hull, fill=255)
    # shrink 2px so the anti-aliased outer edge stays soft
    m = m.filter(ImageFilter.MinFilter(5))
    return np.asarray(m) > 127


def to_image(rgba: np.ndarray) -> Image.Image:
    return Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), "RGBA")


def trim(img: Image.Image, pad: int) -> Image.Image:
    a = np.asarray(img)[..., 3]
    ys, xs = np.where(a > 6)
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0),
           min(xs.max() + pad + 1, img.width), min(ys.max() + pad + 1, img.height))
    return img.crop(box)


def fit_width(img: Image.Image, w: int) -> Image.Image:
    h = round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)


def square(img: Image.Image, size: int, pad_ratio=0.06, bg=(0, 0, 0, 0)) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    inner = int(size * (1 - 2 * pad_ratio))
    im = img.copy()
    im.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    return canvas


# ---------------------------------------------------------------- horizontal lockup
rgb = np.asarray(Image.open(HORIZONTAL).convert("RGB"))
rgba = color_to_alpha(rgb)

# Keep the white face inside the hexagon mark opaque.
mark_zone = np.zeros(rgb.shape[:2], bool)
mark_zone[:, :DIVIDER_X - 30] = True
navy = (rgb.max(axis=2) < 140) & mark_zone
inside = hull_region(navy) & mark_zone
inside_a = inside[..., None]
rgba = np.where(inside_a, np.concatenate([rgb / 255.0, np.ones_like(rgba[..., :1])], 2), rgba)

lockup = trim(to_image(rgba), pad=6)
fit_width(lockup, 760).save(OUT_ASSETS / "logo-horizontal.webp", "WEBP", quality=92, method=6)
fit_width(lockup, 760).save(OUT_ASSETS / "logo-horizontal.png", optimize=True)

# ---------------------------------------------------------------- icon mark
mark = trim(to_image(rgba[:, :DIVIDER_X - 30]), pad=4)
m_sq = square(mark, 512, pad_ratio=0.02)
m_sq.resize((256, 256), Image.LANCZOS).save(OUT_ASSETS / "logo-mark.webp", "WEBP", quality=92, method=6)

for s in (16, 32):
    square(mark, 256, 0.0).resize((s, s), Image.LANCZOS).save(OUT_PUBLIC / f"favicon-{s}.png", optimize=True)
square(mark, 256, 0.0).save(OUT_PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
for s in (192, 512):
    square(mark, s, 0.08).save(OUT_PUBLIC / f"icon-{s}.png", optimize=True)
# iOS ignores transparency -> place on white
square(mark, 180, 0.12, bg=(255, 255, 255, 255)).convert("RGB").save(OUT_PUBLIC / "apple-touch-icon.png", optimize=True)

# ---------------------------------------------------------------- circular badge
b = Image.open(BADGE).convert("RGBA")
barr = np.asarray(b.convert("RGB")).astype(int)
ring = (barr[..., 2] > 150) & (barr[..., 0] < 80)  # blue ring pixels
ys, xs = np.where(ring)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
r = max(xs.max() - xs.min(), ys.max() - ys.min()) / 2 + 1.5
S = 4
mask = Image.new("L", (b.width * S, b.height * S), 0)
ImageDraw.Draw(mask).ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
mask = mask.resize(b.size, Image.LANCZOS)
b.putalpha(mask)
b = b.crop((int(cx - r - 2), int(cy - r - 2), int(cx + r + 3), int(cy + r + 3)))
b.resize((640, 640), Image.LANCZOS).save(OUT_ASSETS / "logo-badge.webp", "WEBP", quality=90, method=6)

# ---------------------------------------------------------------- Open Graph image
og = Image.new("RGBA", (1200, 630), (234, 243, 252, 255))
d = ImageDraw.Draw(og)
d.rounded_rectangle([60, 60, 1140, 570], radius=48, fill=(255, 255, 255, 255))
logo = fit_width(lockup, 840)
og.alpha_composite(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
og.convert("RGB").save(OUT_PUBLIC / "og-image.jpg", quality=88, optimize=True, progressive=True)

print("Assets generated:")
for p in sorted(list(OUT_ASSETS.iterdir()) + [q for q in OUT_PUBLIC.iterdir() if q.is_file()]):
    print(f"  {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.1f} KB")
