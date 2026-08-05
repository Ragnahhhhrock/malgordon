from PIL import Image, ImageDraw, ImageFont
import os

BG = (15, 20, 27)
BG_ALT = (20, 27, 36)
RULE = (42, 52, 65)
INK = (236, 231, 216)
INK_DIM = (183, 188, 196)
MUTED = (124, 132, 148)
GOLD = (201, 162, 39)
GOLD_DIM = (138, 114, 32)
TEAL = (62, 140, 124)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

os.makedirs("assets", exist_ok=True)

# ---------------------------------------------------------------
# 1. Social share image (Open Graph + Twitter Card), 1200x630
# ---------------------------------------------------------------
W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# subtle radial-ish glow top-left using concentric translucent circles
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
cx, cy = 160, -80
for r, a in [(700, 10), (550, 14), (400, 18), (250, 20)]:
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(GOLD[0], GOLD[1], GOLD[2], a))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

# ledger tick rule down the left margin
margin_x = 90
d.line([(margin_x - 34, 120), (margin_x - 34, 470)], fill=RULE, width=1)

# tick dots along the rule (gold / teal / muted), evenly spaced
dot_ys = [150, 210, 270, 330, 390, 450]
dot_colors = [GOLD, TEAL, GOLD, TEAL, MUTED, GOLD]
for y, c in zip(dot_ys, dot_colors):
    d.ellipse([margin_x - 39, y - 5, margin_x - 29, y + 5], fill=BG, outline=c, width=2)
    if c != MUTED:
        d.ellipse([margin_x - 37, y - 3, margin_x - 31, y + 3], fill=c)

# eyebrow
eyebrow_font = ImageFont.truetype(MONO_BOLD, 22)
d.text((margin_x, 128), "PERTH, WESTERN AUSTRALIA", font=eyebrow_font, fill=GOLD)

# name / headline
name_font = ImageFont.truetype(SERIF, 76)
d.text((margin_x, 172), "Malcolm Gordon", font=name_font, fill=INK)

tagline_font = ImageFont.truetype(SERIF, 40)
d.text((margin_x, 268), "Builder of startups,", font=tagline_font, fill=INK_DIM)
d.text((margin_x, 316), "marketing systems &", font=tagline_font, fill=INK_DIM)
d.text((margin_x, 364), "the occasional viral idea.", font=tagline_font, fill=INK_DIM)

# ticker strip stats
stat_font = ImageFont.truetype(MONO, 19)
stat_font_b = ImageFont.truetype(MONO_BOLD, 19)
stats = [("15+ YRS", " marketing"), ("12+ YRS", " mentoring"), ("9", " ventures built")]
sx = margin_x
sy = 447
max_x = W - 90 - 300 - 40
for bold_part, rest in stats:
    bw = d.textlength(bold_part, font=stat_font_b)
    rw = d.textlength(rest, font=stat_font)
    if sx + bw + rw > max_x:
        break
    d.text((sx, sy), bold_part, font=stat_font_b, fill=INK)
    d.text((sx + bw, sy), rest, font=stat_font, fill=MUTED)
    sx += bw + rw + 32

# bottom rule + url
d.line([(margin_x, 512), (W - 90, 512)], fill=RULE, width=1)
url_font = ImageFont.truetype(MONO_BOLD, 26)
d.text((margin_x, 540), "malgordon.com", font=url_font, fill=GOLD)

sub_font = ImageFont.truetype(MONO, 20)
d.text((margin_x, 576), "Startup community builder · Growth marketer", font=sub_font, fill=MUTED)

# --- profile photo, circular, right side ---
photo_path = "assets/malcolm-gordon.jpg"
if os.path.exists(photo_path):
    photo_d = 280
    photo = Image.open(photo_path).convert("RGB")
    side = min(photo.size)
    left = (photo.width - side) // 2
    top = (photo.height - side) // 2
    photo = photo.crop((left, top, left + side, top + side)).resize((photo_d, photo_d), Image.LANCZOS)

    mask = Image.new("L", (photo_d, photo_d), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse([0, 0, photo_d, photo_d], fill=255)

    px = W - 90 - photo_d
    py = (H - photo_d) // 2

    # ring behind photo matching --bg-alt, plus thin rule border
    ring_pad = 8
    img_rgba = img.convert("RGBA")
    ring_layer = ImageDraw.Draw(img_rgba)
    ring_layer.ellipse(
        [px - ring_pad, py - ring_pad, px + photo_d + ring_pad, py + photo_d + ring_pad],
        fill=BG_ALT,
    )
    ring_layer.ellipse(
        [px - ring_pad, py - ring_pad, px + photo_d + ring_pad, py + photo_d + ring_pad],
        outline=RULE, width=2,
    )
    img_rgba.paste(photo, (px, py), mask)
    img = img_rgba.convert("RGB")
    d = ImageDraw.Draw(img)

img.save("assets/social-share.png", "PNG", optimize=True)
print("wrote assets/social-share.png", img.size)

# ---------------------------------------------------------------
# 2. Favicon set — gold "M" monogram + ticker dot, dark ledger bg
# ---------------------------------------------------------------
def make_icon(size, corner_radius_ratio=0.22):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    r = int(size * corner_radius_ratio)
    dr.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=BG)
    dr.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, outline=RULE, width=max(1, size // 64))

    font_size = int(size * 0.56)
    font = ImageFont.truetype(SERIF, font_size)
    bbox = dr.textbbox((0, 0), "M", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) / 2 - bbox[0]
    ty = (size - th) / 2 - bbox[1] - size * 0.03
    dr.text((tx, ty), "M", font=font, fill=GOLD)

    # ticker dot accent, top-right
    dot_r = max(2, int(size * 0.075))
    dcx, dcy = size - dot_r - int(size * 0.12), dot_r + int(size * 0.12)
    dr.ellipse([dcx - dot_r, dcy - dot_r, dcx + dot_r, dcy + dot_r], fill=GOLD)
    return im

icon_512 = make_icon(512)
icon_512.save("assets/favicon-512.png")

icon_32 = make_icon(32)
icon_32.save("favicon-32.png")

icon_16 = make_icon(16, corner_radius_ratio=0.18)
icon_16.save("favicon-16.png")

apple = make_icon(180, corner_radius_ratio=0.22)
apple.save("apple-touch-icon.png")

# multi-res favicon.ico
icon_512.resize((256, 256), Image.LANCZOS).save(
    "favicon.ico",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (256, 256)],
)

print("wrote favicon-32.png, favicon-16.png, apple-touch-icon.png, favicon.ico")

# favicon.svg — simple vector version for modern browsers
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect x="0.5" y="0.5" width="63" height="63" rx="14" fill="rgb{BG}" stroke="rgb{RULE}"/>
<text x="32" y="45" font-family="Georgia, 'DejaVu Serif', serif" font-weight="700"
 font-size="34" fill="rgb{GOLD}" text-anchor="middle">M</text>
<circle cx="49" cy="15" r="4.5" fill="rgb{GOLD}"/>
</svg>'''
with open("favicon.svg", "w") as f:
    f.write(svg)
print("wrote favicon.svg")

# ---------------------------------------------------------------
# 3. YouTube channel art — banner (2560x1440, safe area 1546x423
#    centered) + square avatar (800x800)
# ---------------------------------------------------------------
os.makedirs("assets/youtube", exist_ok=True)

BW, BH = 2560, 1440
banner = Image.new("RGB", (BW, BH), BG)
bd = ImageDraw.Draw(banner)

glow2 = Image.new("RGBA", (BW, BH), (0, 0, 0, 0))
g2d = ImageDraw.Draw(glow2)
gcx, gcy = 420, 250
for r, a in [(1300, 8), (1000, 11), (700, 15), (450, 18)]:
    g2d.ellipse([gcx - r, gcy - r, gcx + r, gcy + r], fill=(GOLD[0], GOLD[1], GOLD[2], a))
banner = Image.alpha_composite(banner.convert("RGBA"), glow2).convert("RGB")
bd = ImageDraw.Draw(banner)

# safe area for text/logo: centered 1546 x 423 box (YouTube's minimum safe zone)
safe_w, safe_h = 1546, 423
safe_x0 = (BW - safe_w) // 2
safe_y0 = (BH - safe_h) // 2

# ledger rule + dots, left edge of safe area
rule_x = safe_x0 + 4
bd.line([(rule_x, safe_y0 + 10), (rule_x, safe_y0 + safe_h - 10)], fill=RULE, width=2)
dot_ys2 = [safe_y0 + 40, safe_y0 + 110, safe_y0 + 180, safe_y0 + 250, safe_y0 + 320, safe_y0 + 390]
dot_colors2 = [GOLD, TEAL, GOLD, TEAL, MUTED, GOLD]
for y, c in zip(dot_ys2, dot_colors2):
    bd.ellipse([rule_x - 9, y - 9, rule_x + 9, y + 9], fill=BG, outline=c, width=3)
    if c != MUTED:
        bd.ellipse([rule_x - 5, y - 5, rule_x + 5, y + 5], fill=c)

text_x = rule_x + 60

eyebrow_f = ImageFont.truetype(MONO_BOLD, 30)
bd.text((text_x, safe_y0 + 26), "PERTH, WESTERN AUSTRALIA", font=eyebrow_f, fill=GOLD)

name_f = ImageFont.truetype(SERIF, 96)
bd.text((text_x, safe_y0 + 72), "Malcolm Gordon", font=name_f, fill=INK)

tag_f = ImageFont.truetype(SANS, 34)
bd.text((text_x, safe_y0 + 200), "Startups · Growth marketing · Perth's founder community",
         font=tag_f, fill=INK_DIM)

url_f = ImageFont.truetype(MONO_BOLD, 30)
bd.text((text_x, safe_y0 + 260), "malgordon.com", font=url_f, fill=GOLD)
handle_f = ImageFont.truetype(MONO, 26)
bd.text((text_x, safe_y0 + 305), "@MalcolmGordonliveshere", font=handle_f, fill=MUTED)

banner.save("assets/youtube/banner.png", "PNG", optimize=True)
print("wrote assets/youtube/banner.png", banner.size)

# square avatar, using the real headshot cropped to a clean square
# (YouTube applies its own circular mask on top of a square upload)
photo_path = "assets/malcolm-gordon.jpg"
if os.path.exists(photo_path):
    av = Image.open(photo_path).convert("RGB")
    side = min(av.size)
    left = (av.width - side) // 2
    top = (av.height - side) // 2
    av = av.crop((left, top, left + side, top + side)).resize((800, 800), Image.LANCZOS)
    # thin ledger-toned ring frame to tie back to the site's avatar treatment
    framed = Image.new("RGB", (800, 800), BG_ALT)
    fd = ImageDraw.Draw(framed)
    fd.ellipse([0, 0, 799, 799], fill=BG_ALT)
    mask2 = Image.new("L", (800, 800), 0)
    ImageDraw.Draw(mask2).ellipse([14, 14, 785, 785], fill=255)
    framed.paste(av, (0, 0), mask2)
    fd.ellipse([2, 2, 797, 797], outline=RULE, width=4)
    framed.save("assets/youtube/avatar.png", "PNG", optimize=True)
    print("wrote assets/youtube/avatar.png", framed.size)
