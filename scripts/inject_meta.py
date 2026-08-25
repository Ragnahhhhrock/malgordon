import glob, re

SITE_URL = "https://malgordon.com"

KEYWORDS_HOME = ("Malcolm Gordon, startup mentor Perth, growth marketer, digital marketing "
                  "analyst, Startup Weekend Perth, Spacecubed, Plus Eight, ECU digital marketing, "
                  "startup community builder Western Australia")

PROJECT_KEYWORDS = {
    "wouldpieteat": "WouldPietEat, AI food judge, computer vision app, whole foods diet app",
    "hornetbay": "Hornet Bay, F/A-18 flight simulator, browser carrier ops game, dogfight game",
    "propcheq": "PropCheq, Malcolm Gordon project",
    "offsetcheck": "Offsetcheck, mortgage offset audit, bank interest checker, Australian homeowners",
    "charttv": "Charttv, technical analysis vlog, finance YouTube channel",
    "sleepcap": "Sleep-cap.com, Joomla e-commerce, early e-commerce build",
    "blingvaders": "Blingvaders, retro jewellery brand, viral product launch",
    "buildcloud": "Buildcloud, construction tech startup, Lean Canvas",
    "threadster": "Threadster, Startup Weekend Perth, indie designer platform",
    "adshirts": "AdShirts, wearable ad-tech, digital display t-shirts",
}

def build_head_extra(path, title, description, is_home):
    if is_home:
        url = SITE_URL + "/"
        img = SITE_URL + "/assets/social-share.png"
        fav_prefix = ""
        keywords = KEYWORDS_HOME
    else:
        slug = path.split("/")[-1].replace(".html", "")
        url = f"{SITE_URL}/projects/{slug}.html"
        img = SITE_URL + "/assets/social-share.png"
        fav_prefix = "../"
        keywords = PROJECT_KEYWORDS.get(slug, "Malcolm Gordon, Perth startup builder")

    return f'''<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{url}">

<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="{fav_prefix}favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="{fav_prefix}favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="{fav_prefix}favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="{fav_prefix}apple-touch-icon.png">
<link rel="icon" href="{fav_prefix}favicon.ico">

<!-- Open Graph -->
<meta property="og:type" content="{'website' if is_home else 'article'}">
<meta property="og:site_name" content="Malcolm Gordon">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@malgordon">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{img}">
'''

files = ["index.html"] + glob.glob("projects/*.html")

for path in files:
    with open(path) as f:
        c = f.read()

    title_m = re.search(r"<title>(.*?)</title>", c, re.S)
    desc_m = re.search(r'<meta name="description" content="(.*?)">', c, re.S)
    title = title_m.group(1).replace("&amp;", "&")
    description = desc_m.group(1).replace("&amp;", "&")

    is_home = path == "index.html"
    extra = build_head_extra(path, title, description, is_home)

    marker = desc_m.group(0)
    assert marker in c
    c = c.replace(marker, marker + "\n" + extra, 1)

    with open(path, "w") as f:
        f.write(c)
    print("updated", path)
