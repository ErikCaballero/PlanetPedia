from pathlib import Path
from PIL import Image, ImageOps
import sys
folder=Path(sys.argv[1] if len(sys.argv)>1 else ".")
for src in folder.rglob("*"):
    if src.is_file() and src.suffix.lower() in {".jpg",".jpeg",".png"}:
        dst=src.with_suffix(".webp")
        with Image.open(src) as im:
            im=ImageOps.exif_transpose(im)
            im=im.convert("RGBA" if im.mode in ("RGBA","LA") or "transparency" in im.info else "RGB")
            im.save(dst,"WEBP",quality=82,method=2)
        print(f"{src} -> {dst}")
