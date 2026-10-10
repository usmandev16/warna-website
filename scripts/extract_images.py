"""Extract embedded raster images from the client PDFs.

Usage: python -I scripts/extract_images.py <out_dir>

Each unique image (by xref) is written once as PNG at native resolution,
merged with its soft mask (smask) so cut-outs keep their transparency.
Invoked by scripts/extract-assets.mjs; can also be run on its own.
"""

import json
import pathlib
import sys

import numpy as np
import pymupdf
from PIL import Image
from scipy.ndimage import gaussian_filter, maximum_filter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = {
    "profile": ROOT / "_source" / "company-profile.pdf",
    "brand": ROOT / "_source" / "brand-guidelines.pdf",
}


def to_rgb(pix: pymupdf.Pixmap) -> pymupdf.Pixmap:
    if pix.alpha:
        pix = pymupdf.Pixmap(pix, 0)
    if pix.colorspace is None or pix.colorspace.n != 3:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return pix


def main() -> None:
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    manifest = []
    for tag, path in SOURCES.items():
        doc = pymupdf.open(path)
        seen: set[int] = set()
        for page_index, page in enumerate(doc):
            for info in page.get_images(full=True):
                xref, smask = info[0], info[1]
                if xref in seen:
                    continue
                seen.add(xref)
                pix = to_rgb(pymupdf.Pixmap(doc, xref))
                if smask:
                    mask = pymupdf.Pixmap(doc, smask)
                    if (mask.width, mask.height) == (pix.width, pix.height):
                        pix = pymupdf.Pixmap(pix, mask)
                name = f"{tag}-p{page_index + 1:02d}-x{xref}.png"
                pix.save(out / name)
                manifest.append(
                    {
                        "file": name,
                        "source": tag,
                        "page": page_index + 1,
                        "width": pix.width,
                        "height": pix.height,
                        "alpha": bool(pix.alpha),
                    }
                )
    manifest += render_clean_pages(out)
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(json.dumps(manifest))


def inpaint(image: Image.Image, mask: Image.Image, radius: float) -> Image.Image:
    """Fill masked pixels from their surroundings (normalised Gaussian blur).

    Works well here because the text and logo sit on soft, smooth gradients.
    """
    hole = np.asarray(mask, dtype=np.float32) / 255.0
    keep = 1.0 - hole
    pixels = np.asarray(image, dtype=np.float32)
    weight = gaussian_filter(keep, radius)
    filled = np.stack(
        [gaussian_filter(pixels[..., c] * keep, radius) / np.maximum(weight, 1e-6) for c in range(3)],
        axis=-1,
    )
    soft = gaussian_filter(hole, radius / 8)[..., None]
    result = pixels * (1 - soft) + filled * soft
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8))


def shape_mask(rect: pymupdf.Rect, drawings: list[dict], dpi: int) -> Image.Image:
    """Rasterise the given vector paths as a white-on-black, slightly dilated mask."""
    scratch = pymupdf.open()
    page = scratch.new_page(width=rect.width, height=rect.height)
    page.draw_rect(page.rect, color=None, fill=(0, 0, 0))
    for drawing in drawings:
        shape = page.new_shape()
        for item in drawing["items"]:
            kind = item[0]
            if kind == "l":
                shape.draw_line(item[1], item[2])
            elif kind == "c":
                shape.draw_bezier(item[1], item[2], item[3], item[4])
            elif kind == "re":
                shape.draw_rect(item[1])
            elif kind == "qu":
                shape.draw_quad(item[1])
        shape.finish(color=None, fill=(1, 1, 1), even_odd=bool(drawing.get("even_odd")), closePath=True)
        shape.commit()
    pix = page.get_pixmap(dpi=dpi, colorspace=pymupdf.csGRAY)
    mask = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width)
    return Image.fromarray(maximum_filter(mask, size=13))


def render_clean_pages(out: pathlib.Path) -> list[dict]:
    """Render profile pages as composited artwork with text and logo removed.

    The copper silk on profile p1–p2 is a neon ribbon recoloured by full-page
    blend layers in Illustrator, so neither the raw image nor vector removal
    gives the real look. The small vectors (logo, swoosh) are drawn into a
    mask from their own outlines and inpainted. Text is handled per page:
    on p1 a text-only redaction is clean; on p2 it damages the artwork, so
    the page is cropped above the paragraph instead.
    """
    doc = pymupdf.open(SOURCES["profile"])
    dpi = 144
    # (page, remove text by redaction, crop bottom edge in points)
    pages = ((1, True, None), (2, False, 690))
    rendered = []
    for page_number, redact_text, crop_bottom in pages:
        page = doc[page_number - 1]
        marks = [d for d in page.get_drawings() if d["rect"].width < 1900]
        if redact_text:
            for block in page.get_text("dict")["blocks"]:
                for line in block.get("lines", []):
                    for span in line["spans"]:
                        page.add_redact_annot(pymupdf.Rect(span["bbox"]), fill=None)
            page.apply_redactions(
                images=pymupdf.PDF_REDACT_IMAGE_NONE,
                graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                text=pymupdf.PDF_REDACT_TEXT_REMOVE,
            )
        pix = page.get_pixmap(dpi=dpi)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        mask = shape_mask(page.rect, marks, dpi)
        image = inpaint(image, mask, radius=28)
        if crop_bottom:
            image = image.crop((0, 0, image.width, round(crop_bottom * dpi / 72)))
        name = f"profile-p{page_number:02d}-clean.png"
        image.save(out / name)
        rendered.append(
            {
                "file": name,
                "source": "profile",
                "page": page_number,
                "width": image.width,
                "height": image.height,
                "alpha": False,
            }
        )
    return rendered


if __name__ == "__main__":
    main()
