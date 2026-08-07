#!/usr/bin/env python3
"""Détoure les photos produit : supprime le fond, recadre sur la boîte englobante
alpha, redimensionne, et enregistre des PNG transparents dans src/assets/products/.

Usage : python3 scripts/remove_bg.py
"""
import io
import os
from PIL import Image
from rembg import remove, new_session

UPLOADS = "/root/.claude/uploads/0027802f-2f73-506d-8118-2ceb986751df"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "products")
MAX_SIZE = 1000  # px sur le plus grand côté

# fichier source -> nom de sortie
MAPPING = {
    "f929a867-1001850889.jpg": "oryx.png",
    "60e08ea9-1001850895.webp": "oryx-famille.png",
    "cc49b170-1001850900.webp": "benin-petro.png",
    "b832c48e-1001850898.png": "progaz.png",
    "5850fef4-1001850899.png": "progaz-haut.png",
    "d69541bb-1001850901.jpg": "raccord.png",
    "6a7d886b-1001850902.png": "rechaud.png",
    "5c3570fb-1001850903.png": "support-bruleur.png",
}


def process(session, src_path, out_path, square=True):
    with open(src_path, "rb") as f:
        cut = remove(f.read(), session=session)
    img = Image.open(io.BytesIO(cut)).convert("RGBA")

    # Recadrer sur le contenu opaque.
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # Placer le contenu, centré, sur un canevas carré transparent : toutes les
    # images s'alignent alors parfaitement au centre de leur carte.
    if square:
        w, h = img.size
        side = int(max(w, h) * 1.10)
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
        img = canvas

    # Redimensionner en gardant les proportions.
    img.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    img.save(out_path, "PNG", optimize=True)
    return img.size


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    session = new_session("u2net")
    for src, out in MAPPING.items():
        src_path = os.path.join(UPLOADS, src)
        out_path = os.path.join(OUT_DIR, out)
        if not os.path.exists(src_path):
            print(f"!! introuvable : {src}")
            continue
        size = process(session, src_path, out_path, square=(out != "oryx-famille.png"))
        print(f"ok  {out:22} {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
