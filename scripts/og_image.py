"""
Hexora Labs - social preview card (Open Graph image).

Generates frontend/public/og-image.jpg (1200x630), the card shown when the site
link is shared on WhatsApp, Messenger/Facebook, Telegram, LinkedIn, X, etc.
Uses the site's own fonts (Sora, Inter from @fontsource-variable) and the
processed logo. Key content stays near the centre, because some apps crop the
card to a square thumbnail.

Usage:  python scripts/og_image.py   (also run by scripts/process_assets.py)
Requires: Pillow (and the npm packages installed, for the fonts)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@fontsource-variable"
LOGO = ROOT / "frontend" / "src" / "assets" / "brand" / "logo-horizontal.png"
OUT = ROOT / "frontend" / "public" / "og-image.jpg"

W, H = 1200, 630
S = 2  # supersample for smooth edges
NAVY = (11, 35, 67)
PRIMARY = (0, 102, 230)
CYAN = (0, 185, 241)
ICE = (234, 243, 252)
LINE = (219, 230, 242)
MUTED = (75, 90, 110)

HEADLINE_1 = "Your Vision."
HEADLINE_2 = "Engineered into Reality."
PILLS = ["Websites", "Web Apps", "Mobile Apps", "Desktop", "APIs", "AI & Data", "Student Projects"]


def font(family: str, size: int, weight: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / family / "files" / f"{family}-latin-wght-normal.woff2"), size * S)
    f.set_variation_by_axes([weight])
    return f


def glow(canvas: Image.Image, center, radius, color, alpha):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    cx, cy = center
    ImageDraw.Draw(layer).ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(*color, alpha))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius * 0.45)))


def gradient_text(canvas, xy, text, f, c1, c2):
    """Draw text filled with a horizontal c1→c2 gradient."""
    x, y = xy
    l, t, r, b = f.getbbox(text)
    mask = Image.new("L", (r, b), 0)
    ImageDraw.Draw(mask).text((0, 0), text, font=f, fill=255)
    grad = Image.new("RGBA", (r, b))
    gd = ImageDraw.Draw(grad)
    for i in range(r):
        k = i / max(r - 1, 1)
        gd.line([(i, 0), (i, b)], fill=tuple(round(c1[j] + (c2[j] - c1[j]) * k) for j in range(3)) + (255,))
    canvas.paste(grad, (x, y), mask)


def main():
    w, h = W * S, H * S
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    d = ImageDraw.Draw(img)

    # soft vertical wash white → ice
    for yy in range(h):
        k = yy / (h - 1)
        d.line([(0, yy), (w, yy)], fill=tuple(round(255 + (ICE[j] - 255) * k) for j in range(3)) + (255,))

    # faint technical grid
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = 48 * S
    for gx in range(0, w, step):
        gd.line([(gx, 0), (gx, h)], fill=(*LINE, 120), width=S)
    for gy in range(0, h, step):
        gd.line([(0, gy), (w, gy)], fill=(*LINE, 120), width=S)
    img.alpha_composite(grid)

    # brand glows
    glow(img, (w * 0.92, h * 0.05), 360 * S, CYAN, 70)
    glow(img, (w * 0.05, h * 1.0), 380 * S, PRIMARY, 45)

    # logo lockup
    logo = Image.open(LOGO).convert("RGBA")
    lw = 430 * S
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    img.alpha_composite(logo, ((w - logo.width) // 2, 62 * S))

    # headline
    f_head = font("sora", 66, 700)
    y1 = 228 * S
    t1 = HEADLINE_1
    bw = d.textlength(t1, font=f_head)
    d.text(((w - bw) / 2, y1), t1, font=f_head, fill=NAVY)
    t2 = HEADLINE_2
    bw2 = d.textlength(t2, font=f_head)
    gradient_text(img, (round((w - bw2) / 2), y1 + 84 * S), t2, f_head, PRIMARY, CYAN)

    # service pills (two centred rows)
    f_pill = font("inter", 23, 600)
    pad_l, pad_r, pill_h, gap = 40 * S, 22 * S, 50 * S, 14 * S
    dot_x, dot_r = 22 * S, 5 * S
    # vertical centre from the font's cap height, so every label sits on the same line
    cap_top, cap_bottom = f_pill.getbbox("H")[1], f_pill.getbbox("H")[3]
    rows = [PILLS[:4], PILLS[4:]]
    py = 440 * S
    for row in rows:
        widths = [d.textlength(p, font=f_pill) + pad_l + pad_r for p in row]
        total = sum(widths) + gap * (len(row) - 1)
        px = (w - total) / 2
        for label, pw in zip(row, widths):
            cy = py + pill_h / 2
            d.rounded_rectangle([px, py, px + pw, py + pill_h], radius=pill_h // 2,
                                fill=(255, 255, 255, 255), outline=LINE, width=2 * S)
            d.ellipse([px + dot_x - dot_r, cy - dot_r, px + dot_x + dot_r, cy + dot_r], fill=CYAN)
            d.text((px + pad_l, cy - (cap_top + cap_bottom) / 2), label, font=f_pill, fill=NAVY)
            px += pw + gap
        py += pill_h + 14 * S

    # bottom accent bar
    bar = Image.new("RGBA", (w, 8 * S))
    bd = ImageDraw.Draw(bar)
    for i in range(w):
        k = i / (w - 1)
        bd.line([(i, 0), (i, 8 * S)], fill=tuple(round(PRIMARY[j] + (CYAN[j] - PRIMARY[j]) * k) for j in range(3)) + (255,))
    img.alpha_composite(bar, (0, h - 8 * S))

    out = img.resize((W, H), Image.LANCZOS).convert("RGB")
    out.save(OUT, quality=90, optimize=True, progressive=True)
    print(f"  {OUT.relative_to(ROOT)}  {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
