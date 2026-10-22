#!/usr/bin/env python3
"""Build the malgordon.com explainer video (1280x720, 52 s, with synthesized music).

Usage (from repo root):  python3 scripts/build_explainer_video.py
Outputs:
  assets/malgordon-explainer.mp4
  assets/malgordon-explainer-poster.jpg

Visual language follows STYLE_GUIDE.md ("The Ledger"): dark ink background, gold/teal
accents, serif display type, monospace labels. Fonts fall back to DejaVu as the guide allows.
The music track is synthesized here (numpy) so no third-party audio is involved.
"""
import math
import os
import subprocess
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_MP4 = os.path.join(ROOT, "assets", "malgordon-explainer.mp4")
OUT_POSTER = os.path.join(ROOT, "assets", "malgordon-explainer-poster.jpg")
TMP_WAV = os.path.join(ROOT, "assets", ".explainer-music.wav")

W, H, FPS, DUR = 1280, 720, 30, 52.0

# Palette (STYLE_GUIDE.md)
BG = (15, 20, 27)
BG_ALT = (20, 27, 36)
CARD = (25, 33, 43)
RULE = (42, 52, 65)
INK = (236, 231, 216)
INK_DIM = (183, 188, 196)
MUTED = (124, 132, 148)
GOLD = (201, 162, 39)
GOLD_DIM = (138, 114, 32)
TEAL = (62, 140, 124)
TEAL_DIM = (42, 95, 84)

FD = "/usr/share/fonts/truetype/dejavu/"


def font(name, size):
    return ImageFont.truetype(FD + name, size)


F_DISPLAY = lambda s: font("DejaVuSerif-Bold.ttf", s)
F_MONO = lambda s: font("DejaVuSansMono.ttf", s)
F_MONO_B = lambda s: font("DejaVuSansMono-Bold.ttf", s)
F_BODY = lambda s: font("DejaVuSans.ttf", s)

# Scene timeline (seconds)
S = {
    "intro": (0.0, 5.5),
    "ledger": (5.5, 13.0),
    "numbers": (13.0, 25.0),
    "projects": (25.0, 41.0),
    "explore": (41.0, 47.0),
    "cta": (47.0, 52.0),
}


# ---------- helpers ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def prog(t, start, dur):
    return ease((t - start) / dur)


def text(layer, xy, s, fnt, fill, alpha=1.0, anchor="la"):
    if alpha <= 0:
        return
    d = ImageDraw.Draw(layer)
    d.text(xy, s, font=fnt, fill=fill + (int(255 * clamp(alpha)),), anchor=anchor)


def wrap(s, fnt, max_w):
    words, lines, cur = s.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if fnt.getlength(trial) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def rrect(layer, box, fill=None, outline=None, alpha=1.0, radius=3, width=1):
    d = ImageDraw.Draw(layer)
    a = int(255 * clamp(alpha))
    d.rounded_rectangle(
        box,
        radius=radius,
        fill=(fill + (a,)) if fill else None,
        outline=(outline + (a,)) if outline else None,
        width=width,
    )


def dot(layer, cx, cy, r, color, alpha=1.0, hollow=False):
    d = ImageDraw.Draw(layer)
    a = int(255 * clamp(alpha))
    if hollow:
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=color + (a,), width=3)
    else:
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (a,))


def cover(img, w, h):
    iw, ih = img.size
    sc = max(w / iw, h / ih)
    img = img.resize((int(iw * sc) + 1, int(ih * sc) + 1), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


# ---------- assets ----------
def load_assets():
    a = {}
    photo = Image.open(os.path.join(ROOT, "assets", "malcolm-gordon.jpg")).convert("RGB")
    d = 300
    photo = cover(photo, d, d)
    mask = Image.new("L", (d * 2, d * 2), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, d * 2 - 1, d * 2 - 1), fill=255)
    mask = mask.resize((d, d), Image.LANCZOS)
    circ = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    circ.paste(photo, (0, 0), mask)
    a["photo"] = circ

    names = [
        ("tarotgoth.png", "Tarot Goth"),
        ("tareeq.png", "Tareeq"),
        ("powerpoint2vid.png", "PowerPoint2Vid"),
        ("malgordon.png", "malgordon.com"),
        ("crossfaderhero.png", "Crossfader Hero"),
        ("lanparty1998.png", "LAN Party '98"),
        ("setsoflove.png", "SetsOfLove"),
        ("readmyspread.png", "Read My Spread"),
        ("stuckinline.png", "Stuck in Line"),
        ("flykaitak.jpg", "Fly Kai Tak"),
        ("hornetbay.jpg", "Hornet Bay"),
        ("outbackrun.png", "Outback Run"),
    ]
    thumbs = []
    for fn, label in names:
        im = Image.open(os.path.join(ROOT, "assets", "projects", fn)).convert("RGB")
        thumbs.append((cover(im, 240, 135).convert("RGBA"), label))
    a["thumbs"] = thumbs
    return a


# ---------- chrome (always on) ----------
def chrome(layer, t):
    text(layer, (48, 30), "●", F_MONO_B(18), GOLD)
    text(layer, (74, 28), "MALCOLM GORDON", F_MONO_B(17), INK_DIM)
    text(layer, (W - 48, 28), "MALGORDON.COM", F_MONO(17), MUTED, anchor="ra")
    d = ImageDraw.Draw(layer)
    d.line((48, 66, W - 48, 66), fill=RULE + (255,), width=1)
    # progress rule with scene ticks
    y = H - 34
    d.line((48, y, W - 48, y), fill=RULE + (255,), width=1)
    for k, (a, b) in S.items():
        x = 48 + (W - 96) * a / DUR
        d.ellipse((x - 3, y - 3, x + 3, y + 3), fill=MUTED + (255,))
    x = 48 + (W - 96) * clamp(t / DUR)
    d.line((48, y, x, y), fill=GOLD + (255,), width=2)
    d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=GOLD + (255,))


# ---------- scenes (each draws onto a transparent layer using local time lt) ----------
def scene_intro(layer, lt, A):
    p = prog(lt, 0.1, 0.9)
    layer.alpha_composite(A["photo"], (W - 48 - 300 - 20, 150 + int((1 - p) * 20)))
    # photo ring
    d = ImageDraw.Draw(layer)
    d.ellipse((W - 68 - 300 - 3, 147 + int((1 - p) * 20), W - 68 + 3, 147 + 306 + int((1 - p) * 20)),
              outline=GOLD_DIM + (int(255 * p),), width=2)
    text(layer, (72, 150), "PERTH, WESTERN AUSTRALIA", F_MONO(16), GOLD, prog(lt, 0.2, 0.6))
    lines = ["I build startups,", "marketing systems,", "and the occasional", "viral idea."]
    for i, ln in enumerate(lines):
        pp = prog(lt, 0.5 + i * 0.35, 0.7)
        text(layer, (72, 196 + i * 70 + int((1 - pp) * 18)), ln, F_DISPLAY(54), INK, pp)
    tp = prog(lt, 2.4, 0.8)
    d.line((72, 520, 72 + 300 * tp, 520), fill=GOLD_DIM + (255,), width=1)
    text(layer, (72, 540), "Startup builder  ·  Growth marketer  ·  Community builder", F_BODY(20), INK_DIM,
         prog(lt, 2.8, 0.8))
    text(layer, (72, 585), "AN EXPLAINER TO THE SITE IN 52 SECONDS", F_MONO(14), MUTED, prog(lt, 3.4, 0.8))


def scene_ledger(layer, lt, A):
    text(layer, (72, 100), "THE CAREER LEDGER", F_MONO(16), GOLD, prog(lt, 0.0, 0.5))
    text(layer, (72, 128), "A career that reads like a trading register.", F_DISPLAY(38), INK, prog(lt, 0.15, 0.6))
    rows = [
        (GOLD, False, "VENTURE", "9 ventures founded / co-founded", "Shipping on the side since 2005"),
        (TEAL, False, "ROLE", "15+ years of digital marketing", "Running digital marketing for Edith Cowan University"),
        (MUTED, True, "MENTOR", "12+ years mentoring founders", "Startup Weekend and Plus Eight"),
    ]
    x_rule = 130
    y0 = 250
    d = ImageDraw.Draw(layer)
    rp = prog(lt, 0.5, 2.2)
    d.line((x_rule, y0 - 20, x_rule, y0 - 20 + 380 * rp), fill=RULE + (255,), width=2)
    for i, (col, hollow, tag, head, sub) in enumerate(rows):
        t0 = 1.1 + i * 1.5
        pp = prog(lt, t0, 0.6)
        y = y0 + i * 120 + int((1 - pp) * 16)
        dot(layer, x_rule, y + 22, 9, col, pp, hollow)
        # pill
        pw = 120
        rrect(layer, (x_rule + 40, y, x_rule + 40 + pw, y + 28), outline=col if not hollow else MUTED, alpha=pp,
              radius=14)
        text(layer, (x_rule + 40 + pw / 2, y + 14), tag, F_MONO_B(13), col, pp, anchor="mm")
        text(layer, (x_rule + 40 + pw + 24, y - 4), head, F_DISPLAY(32), INK, pp)
        text(layer, (x_rule + 40 + pw + 24, y + 40), sub, F_BODY(20), INK_DIM, pp)
    lp = prog(lt, 5.6, 0.8)
    text(layer, (x_rule + 40, 628 - 20), "● gold = venture built    ● teal = role held    ○ grey = mentoring", F_MONO(15),
         MUTED, lp)


def scene_numbers(layer, lt, A):
    text(layer, (72, 100), "THE NUMBERS", F_MONO(16), GOLD, prog(lt, 0.0, 0.5))
    text(layer, (72, 128), "Results, counted.", F_DISPLAY(38), INK, prog(lt, 0.15, 0.6))
    stats = [
        ("MEDIA SPEND", 10, "$", "M+", "Online advertising media spend", TEAL),
        ("LEADS", 100000, "", "+", "Leads generated", GOLD),
        ("REVENUE", 100, "$", "M+", "Revenue for clients & campaigns", TEAL),
        ("REACH", 150, "", "", "Countries with sales generated", GOLD),
        ("MENTORED", 1000, "", "+", "Founders & entrepreneurs mentored", TEAL),
        ("CAMPAIGNS", 1000, "", "+", "Successful campaigns launched", GOLD),
    ]
    cw, ch, gx, gy = 366, 176, 24, 24
    x0, y0 = 72, 205
    for i, (eyebrow, val, pre, suf, desc, col) in enumerate(stats):
        r, c = divmod(i, 3)
        t0 = 0.6 + i * 0.5
        pp = prog(lt, t0, 0.6)
        x = x0 + c * (cw + gx)
        y = y0 + r * (ch + gy) + int((1 - pp) * 20)
        rrect(layer, (x, y, x + cw, y + ch), fill=CARD, outline=RULE, alpha=pp)
        d = ImageDraw.Draw(layer)
        d.line((x, y, x, y + ch), fill=col + (int(255 * pp),), width=3)
        cnt = prog(lt, t0 + 0.2, 1.6)
        shown = int(round(val * cnt))
        num = f"{pre}{shown:,}{suf}"
        text(layer, (x + 28, y + 24), eyebrow, F_MONO(14), col, pp)
        text(layer, (x + 28, y + 52), num, F_DISPLAY(50), INK, pp)
        for k, ln in enumerate(wrap(desc, F_BODY(18), cw - 56)):
            text(layer, (x + 28, y + 126 + k * 24), ln, F_BODY(18), INK_DIM, pp)


def scene_projects(layer, lt, A):
    text(layer, (72, 100), "CURRENT PROJECTS", F_MONO(16), GOLD, prog(lt, 0.0, 0.5))
    text(layer, (72, 124), "17 projects. 14 live.", F_DISPLAY(38), INK, prog(lt, 0.15, 0.6))
    text(layer, (W - 72, 140), "EACH WITH ITS OWN PAGE AND DOMAIN", F_MONO(14), MUTED,
         prog(lt, 0.4, 0.6), anchor="ra")
    cols, tw, th, gx, gy = 4, 240, 135, 40, 8
    x0, y0 = 100, 172
    for i, (im, label) in enumerate(A["thumbs"]):
        r, c = divmod(i, cols)
        t0 = 0.7 + i * 0.7
        pp = prog(lt, t0, 0.5)
        if pp <= 0:
            continue
        x = x0 + c * (tw + gx)
        y = y0 + r * (th + 30 + gy) + int((1 - pp) * 18)
        tile = im.copy()
        tile.putalpha(int(255 * pp))
        layer.alpha_composite(tile, (x, y))
        rrect(layer, (x, y, x + tw, y + th), outline=GOLD_DIM if pp > 0.95 else RULE, alpha=pp)
        text(layer, (x, y + th + 6), label.upper(), F_MONO(13), INK_DIM, pp)


def scene_explore(layer, lt, A):
    text(layer, (72, 100), "EXPLORE THE LEDGER", F_MONO(16), GOLD, prog(lt, 0.0, 0.5))
    text(layer, (72, 128), "One page, five ways in.", F_DISPLAY(38), INK, prog(lt, 0.15, 0.6))
    tabs = ["Career Ledger", "Skills", "Recommendations", "Volunteering", "Qualifications"]
    desc = [
        "Ventures, roles and mentoring on one timeline",
        "Marketing, analytics, SEO, web development",
        "Recommendations from people Malcolm has worked with",
        "Volunteering and community involvement",
        "Qualifications and education",
    ]
    x = 72
    y = 235
    f = F_MONO(18)
    for i, tname in enumerate(tabs):
        pp = prog(lt, 0.6 + i * 0.3, 0.5)
        wd = int(f.getlength(tname)) + 40
        active = (int((lt - 1.0) / 0.9) % 5) == i and lt > 1.0
        col = GOLD if active else MUTED
        rrect(layer, (x, y, x + wd, y + 40), fill=(GOLD_DIM if active else None), outline=col, alpha=pp, radius=20)
        text(layer, (x + wd / 2, y + 20), tname, f, INK if active else INK_DIM, pp, anchor="mm")
        x += wd + 14
    cur = int(clamp((lt - 1.0) / 0.9, 0, 4.99))
    cp = prog(lt, 1.0 + cur * 0.9, 0.35)
    rrect(layer, (72, 320, W - 72, 520), fill=CARD, outline=RULE, alpha=prog(lt, 0.9, 0.5))
    text(layer, (104, 360), tabs[cur].upper(), F_MONO(15), GOLD, cp)
    text(layer, (104, 400), desc[cur], F_DISPLAY(34), INK, cp)
    text(layer, (104, 470), "Dark and light themes · filters · project pages", F_MONO(14), MUTED,
         prog(lt, 1.2, 0.6))
    text(layer, (72, 570), "Or switch to MalSpace for the retro profile view.", F_BODY(20), INK_DIM, prog(lt, 4.0, 0.8))


def scene_cta(layer, lt, A):
    pp = prog(lt, 0.2, 0.8)
    text(layer, (W / 2, 190 + int((1 - pp) * 16)), "SEE THE FULL LEDGER", F_MONO(18), GOLD, pp, anchor="ma")
    p2 = prog(lt, 0.5, 0.9)
    text(layer, (W / 2, 250 + int((1 - p2) * 16)), "malgordon.com", F_DISPLAY(96), INK, p2, anchor="ma")
    d = ImageDraw.Draw(layer)
    lp = prog(lt, 1.0, 1.0)
    d.line((W / 2 - 220 * lp, 395, W / 2 + 220 * lp, 395), fill=GOLD + (255,), width=2)
    text(layer, (W / 2, 425), "mal@malgordon.com", F_MONO(26), INK_DIM, prog(lt, 1.4, 0.8), anchor="ma")
    text(layer, (W / 2, 485), "Let's build something.", F_BODY(24), INK_DIM, prog(lt, 2.0, 0.8), anchor="ma")


SCENE_FN = {
    "intro": scene_intro,
    "ledger": scene_ledger,
    "numbers": scene_numbers,
    "projects": scene_projects,
    "explore": scene_explore,
    "cta": scene_cta,
}


def render_frame(t, A, bg):
    img = bg.copy()
    for name, (a, b) in S.items():
        if a - 0.01 <= t < b + 0.4:
            lt = t - a
            fade_in = clamp(lt / 0.4)
            fade_out = 1.0 if name == "cta" else clamp((b - t) / 0.4)
            alpha = fade_in * fade_out
            if alpha <= 0:
                continue
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            SCENE_FN[name](layer, lt, A)
            if alpha < 1.0:
                r, g, b_, al = layer.split()
                al = al.point(lambda v: int(v * alpha))
                layer = Image.merge("RGBA", (r, g, b_, al))
            img.alpha_composite(layer)
    ch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    chrome(ch, t)
    img.alpha_composite(ch)
    # end fade to background
    if t > DUR - 0.5:
        k = clamp((t - (DUR - 0.5)) / 0.5)
        black = Image.new("RGBA", (W, H), BG + (int(255 * k),))
        img.alpha_composite(black)
    return img.convert("RGB")


def make_bg():
    bg = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(bg)
    # subtle ledger ruling
    for y in range(110, H - 60, 40):
        d.line((48, y, W - 48, y), fill=(21, 28, 37, 255), width=1)
    d.rectangle((0, 0, W, 66), fill=BG_ALT + (255,))
    return bg


# ---------- music ----------
SR = 44100


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def synth_music(path):
    n = int(SR * DUR)
    out = np.zeros(n, dtype=np.float64)
    beat = 0.6  # 100 BPM
    bar = beat * 4
    chords = [
        ([57, 60, 64], 45),  # Am
        ([53, 57, 60], 41),  # F
        ([60, 64, 67], 48),  # C
        ([55, 59, 62], 43),  # G
    ]

    def add(sig, start):
        i = int(start * SR)
        if i >= n:
            return
        j = min(n, i + len(sig))
        out[i:j] += sig[: j - i]

    def tone(freq, dur, harm=(1, 0.5, 0.25, 0.12), detune=0.0):
        t = np.arange(int(dur * SR)) / SR
        s = np.zeros_like(t)
        for k, a in enumerate(harm, 1):
            s += a * np.sin(2 * math.pi * freq * k * (1 + detune) * t)
        return s, t

    n_bars = int(DUR / bar) + 1
    for b in range(n_bars):
        notes, root = chords[b % 4]
        t0 = b * bar
        # pad
        for nt in notes:
            for dt in (-0.003, 0.003):
                s, t = tone(midi(nt), bar + 0.6, harm=(1, 0.3, 0.1), detune=dt)
                env = np.minimum(1, t / 0.5) * np.exp(-np.maximum(0, t - bar) * 5)
                add(0.05 * s * env, t0)
        # bass (eighths) after bar 1
        if b >= 1:
            for k in range(8):
                s, t = tone(midi(root), 0.3, harm=(1, 0.4, 0.15))
                env = np.exp(-t * 9) * np.minimum(1, t / 0.005)
                add(0.2 * s * env, t0 + k * beat / 2)
        # arpeggio (sixteenths) from bar 2
        if b >= 2:
            pattern = [0, 1, 2, 1, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1]
            for k, pi in enumerate(pattern):
                nt = notes[pi] + 12
                s, t = tone(midi(nt), 0.4, harm=(1, 0.35, 0.1))
                env = np.exp(-t * 12) * np.minimum(1, t / 0.004)
                amp = 0.07 * (0.7 + 0.3 * (k % 4 == 0))
                add(amp * s * env, t0 + k * beat / 4)
        # drums from bar 3
        if b >= 3:
            for k in range(4):
                tt = np.arange(int(0.35 * SR)) / SR
                f = 55 + 95 * np.exp(-tt * 28)
                ph = 2 * math.pi * np.cumsum(f) / SR
                kick = np.sin(ph) * np.exp(-tt * 9)
                add(0.42 * kick, t0 + k * beat)
            rng = np.random.default_rng(b)
            for k in range(8):
                tt = np.arange(int(0.07 * SR)) / SR
                noise = rng.standard_normal(len(tt))
                noise = np.diff(noise, prepend=0)  # crude high-pass
                hat = noise * np.exp(-tt * 70)
                add((0.06 if k % 2 else 0.03) * hat, t0 + k * beat / 2)
            for k in (1, 3):
                tt = np.arange(int(0.2 * SR)) / SR
                rng2 = np.random.default_rng(100 + b * 4 + k)
                sn = rng2.standard_normal(len(tt)) * np.exp(-tt * 22)
                sn += 0.5 * np.sin(2 * math.pi * 190 * tt) * np.exp(-tt * 30)
                add(0.09 * sn, t0 + k * beat)

    # echo
    d1 = int(0.30 * SR)
    echo = np.zeros_like(out)
    echo[d1:] += 0.28 * out[:-d1]
    out = out + echo
    # master
    out /= np.max(np.abs(out)) + 1e-9
    out *= 0.85
    fi = int(0.6 * SR)
    fo = int(3.0 * SR)
    out[:fi] *= np.linspace(0, 1, fi)
    out[-fo:] *= np.linspace(1, 0, fo)
    pcm = (out * 32767).astype(np.int16)
    stereo = np.column_stack([pcm, pcm])
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())


def main():
    print("synthesizing music...")
    synth_music(TMP_WAV)
    A = load_assets()
    bg = make_bg()

    poster = render_frame(2.4, A, bg)
    poster.save(OUT_POSTER, quality=88)

    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", TMP_WAV,
        "-t", str(DUR),
        "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart",
        OUT_MP4,
    ]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(DUR * FPS)
    for i in range(total):
        frame = render_frame(i / FPS, A, bg)
        p.stdin.write(frame.tobytes())
        if i % 150 == 0:
            print(f"frame {i}/{total}", flush=True)
    p.stdin.close()
    p.wait()
    os.remove(TMP_WAV)
    print("done", OUT_MP4)


if __name__ == "__main__":
    main()
