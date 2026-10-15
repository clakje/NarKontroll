"""
Lager SCORM 1.2-pakken for konsept A.

    python scripts/pakk-scorm.py

- Tar bare med kursfilene: index.html, imsmanifest.xml, css/, js/, content/, assets/
  (ikke manus, planer, .claude eller dette skriptet).
- Oppdaterer fillisten i imsmanifest.xml mellom FILER-merkene.
- Skriver dist/NarKontroll-KonseptA-scorm12.zip med skråstrek i stiene
  (Compress-Archive i Windows PowerShell 5.1 bruker bakstrek, som mange LMS-er avviser).
"""
from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

ROT = Path(__file__).resolve().parent.parent
MAPPER = ["css", "js", "content", "assets"]
FILER = ["index.html"]
UTELAT_ENDELSER = {".md", ".txt"}
ZIPNAVN = "NarKontroll-KonseptA-scorm12.zip"


def kursfiler() -> list[str]:
    stier = [f for f in FILER if (ROT / f).is_file()]
    for mappe in MAPPER:
        for fil in sorted((ROT / mappe).rglob("*")):
            if fil.is_file() and fil.suffix.lower() not in UTELAT_ENDELSER and not fil.name.startswith("."):
                stier.append(fil.relative_to(ROT).as_posix())
    return stier


def oppdater_manifest(stier: list[str]) -> str:
    manifest = (ROT / "imsmanifest.xml").read_text(encoding="utf-8")
    linjer = "\n".join(f'      <file href="{s}"/>' for s in stier)
    ny, antall = re.subn(
        r"(<!-- FILER:START -->\n).*?(\n\s*<!-- FILER:SLUTT -->)",
        lambda m: m.group(1) + linjer + m.group(2),
        manifest,
        flags=re.S,
    )
    if antall != 1:
        sys.exit("Fant ikke FILER:START/FILER:SLUTT i imsmanifest.xml")
    (ROT / "imsmanifest.xml").write_text(ny, encoding="utf-8", newline="\n")
    return ny


def main() -> None:
    stier = kursfiler()
    manifest = oppdater_manifest(stier)

    dist = ROT / "dist"
    dist.mkdir(exist_ok=True)
    zipsti = dist / ZIPNAVN
    with zipfile.ZipFile(zipsti, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("imsmanifest.xml", manifest)
        for s in stier:
            z.write(ROT / s, s)

    storrelse = zipsti.stat().st_size / 1024
    print(f"{len(stier) + 1} filer pakket i {zipsti.relative_to(ROT).as_posix()} ({storrelse:.0f} KB)")


if __name__ == "__main__":
    main()
