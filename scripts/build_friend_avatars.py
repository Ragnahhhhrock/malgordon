from PIL import Image, ImageDraw
import random

random.seed(42)

PALETTES = [
    [(255, 0, 128), (0, 0, 0), (255, 255, 255)],
    [(0, 220, 255), (10, 10, 40), (255, 255, 0)],
    [(180, 0, 255), (20, 0, 30), (0, 255, 140)],
    [(255, 140, 0), (30, 10, 0), (0, 200, 255)],
    [(0, 255, 100), (0, 30, 10), (255, 0, 200)],
    [(255, 60, 60), (30, 0, 0), (255, 255, 255)],
    [(60, 60, 255), (0, 0, 20), (255, 200, 0)],
]

SIZE = 80
GRID = 8
CELL = SIZE // GRID

for i, palette in enumerate(PALETTES, start=2):
    bg, fg, accent = palette
    img = Image.new("RGB", (SIZE, SIZE), bg)
    d = ImageDraw.Draw(img)

    # symmetric identicon pattern (mirror left half onto right half)
    half = GRID // 2
    for y in range(GRID):
        for x in range(half):
            if random.random() > 0.55:
                d.rectangle(
                    [x * CELL, y * CELL, x * CELL + CELL - 1, y * CELL + CELL - 1],
                    fill=fg,
                )
                d.rectangle(
                    [(GRID - 1 - x) * CELL, y * CELL, (GRID - 1 - x) * CELL + CELL - 1, y * CELL + CELL - 1],
                    fill=fg,
                )

    # a couple of accent-colored cells for sparkle
    for _ in range(4):
        x, y = random.randint(0, GRID - 1), random.randint(0, GRID - 1)
        d.rectangle([x * CELL, y * CELL, x * CELL + CELL - 1, y * CELL + CELL - 1], fill=accent)

    # thin border
    d.rectangle([0, 0, SIZE - 1, SIZE - 1], outline=(0, 0, 0))

    img.save(f"assets/myspace/friends/f{i}.png", "PNG")
    print(f"wrote f{i}.png")
