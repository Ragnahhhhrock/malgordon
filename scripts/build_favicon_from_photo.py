"""Rebuild favicon set using the profile photo, circular-cropped, on the brand background."""
from PIL import Image, ImageDraw
import os

BG = (15, 20, 27)
RULE = (42, 52, 65)
GOLD = (201, 162, 39)

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

SRC = "assets/malcolm-gordon.jpg"
photo = Image.open(SRC).convert("RGB")
side = min(photo.size)
left = (photo.width - side) // 2
top = (photo.height - side) // 2
photo = photo.crop((left, top, left + side, top + side))


def make_icon(size, ring=True):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.ellipse([0, 0, size - 1, size - 1], fill=BG)

    pad = max(1, int(size * 0.06)) if ring else 0
    inner = size - pad * 2
    p = photo.resize((inner, inner), Image.LANCZOS)
    mask = Image.new("L", (inner, inner), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, inner, inner], fill=255)
    canvas.paste(p, (pad, pad), mask)

    if ring:
        w = max(1, size // 32)
        d.ellipse([w // 2, w // 2, size - 1 - w // 2, size - 1 - w // 2], outline=GOLD, width=w)
    return canvas


icon_512 = make_icon(512)
icon_512.save("assets/favicon-512.png")

make_icon(32).save("favicon-32.png")
make_icon(16, ring=False).save("favicon-16.png")
make_icon(180).save("apple-touch-icon.png")

icon_512.resize((256, 256), Image.LANCZOS).save(
    "favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (256, 256)],
)

# SVG wrapper referencing the PNG (browsers that support svg favicons will still render this fine)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs>
<clipPath id="c"><circle cx="32" cy="32" r="31"/></clipPath>
</defs>
<circle cx="32" cy="32" r="31" fill="rgb{BG}"/>
<image href="assets/favicon-512.png" x="2" y="2" width="60" height="60" clip-path="url(#c)"/>
<circle cx="32" cy="32" r="30" fill="none" stroke="rgb{GOLD}" stroke-width="2"/>
</svg>'''
with open("favicon.svg", "w") as f:
    f.write(svg)

print("done")
