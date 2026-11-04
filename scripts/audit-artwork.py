"""Audit the tracked official library using Python 3's standard library only."""

import hashlib
import json
from pathlib import Path
import struct
import zlib


ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def png_info(data, label):
    require(data[:8] == b"\x89PNG\r\n\x1a\n", f"{label}: invalid PNG signature")
    offset, compressed, header, ended = 8, bytearray(), None, False
    while offset < len(data):
        require(offset + 12 <= len(data), f"{label}: truncated chunk")
        size = struct.unpack_from(">I", data, offset)[0]
        kind = data[offset + 4:offset + 8]
        end = offset + 12 + size
        require(end <= len(data), f"{label}: truncated {kind!r}")
        payload = data[offset + 8:end - 4]
        crc = struct.unpack_from(">I", data, end - 4)[0]
        require(zlib.crc32(kind + payload) == crc, f"{label}: chunk CRC mismatch")
        if header is None:
            require(kind == b"IHDR" and size == 13, f"{label}: missing IHDR")
            header = struct.unpack(">IIBBBBB", payload)
        elif kind == b"IHDR":
            raise ValueError(f"{label}: duplicate IHDR")
        if kind == b"IDAT":
            compressed.extend(payload)
        if kind == b"IEND":
            require(size == 0 and end == len(data), f"{label}: invalid IEND")
            ended = True
            break
        offset = end
    require(ended and header is not None, f"{label}: incomplete PNG")
    width, height, depth, colour, compression, filtering, interlace = header
    require(width > 0 and height > 0, f"{label}: invalid dimensions")
    require(depth == 8 and colour in (2, 6) and
            (compression, filtering, interlace) == (0, 0, 0),
            f"{label}: unsupported PNG format; extend audit before accepting")
    decoder = zlib.decompressobj()
    raster = decoder.decompress(compressed) + decoder.flush()
    require(decoder.eof and not decoder.unused_data, f"{label}: invalid image stream")
    stride = width * (3 if colour == 2 else 4) + 1
    require(len(raster) == height * stride, f"{label}: invalid raster size")
    require(all(raster[y * stride] <= 4 for y in range(height)),
            f"{label}: invalid PNG row filter")
    return width, height, "RGB" if colour == 2 else "RGBA"


def main():
    manifest = json.loads((ROOT / "assets/manifest.json").read_text())
    assets = manifest["assets"]
    by_id = {a["id"]: a for a in assets}
    require(len(assets) == len(by_id) == 155, "Expected 155 unique original assets")
    archived = manifest.get("archived_sources", [])
    require(len(archived) == 5, "Expected five preserved earlier source versions")
    sources = assets + archived
    source_ids = {a["id"]: a for a in sources}
    require(len(source_ids) == len(sources) == 160, "Duplicate source IDs")
    require(len({a["path"] for a in sources}) == len(sources), "Duplicate paths")
    pages = [a["page"] for a in assets if "page" in a]
    require(len(pages) == 152 and set(pages) == set(range(1, 155)) - {43, 50},
            "Incorrect numbered-page inventory")
    for asset in sources:
        path = ROOT / asset["path"]
        require(path.resolve().is_relative_to((ROOT / "assets/originals").resolve()),
                f"{asset['id']}: source path escapes originals")
        data = path.read_bytes()
        require(hashlib.sha256(data).hexdigest() == asset["sha256"],
                f"{asset['id']}: SHA-256 mismatch")
        require(png_info(data, asset["id"]) ==
                (asset["width"], asset["height"], asset["mode"]),
                f"{asset['id']}: PNG metadata mismatch")
        if "paired_asset_id" in asset:
            require(by_id[asset["paired_asset_id"]]["paired_asset_id"] == asset["id"],
                    f"{asset['id']}: broken encounter pair")
        if "fallen_piece_asset_id" in asset:
            require(by_id[asset["fallen_piece_asset_id"]]["boat_asset_id"] == asset["id"],
                    f"{asset['id']}: broken fallen-piece pair")
        if "previous_source_id" in asset:
            previous = source_ids[asset["previous_source_id"]]
            require(previous.get("superseded_by_asset_id") == asset["id"] and
                    previous["page"] == asset["page"],
                    f"{asset['id']}: broken revision chain")
    require({a["page"] for a in archived} == {49, 51, 119, 133, 154},
            "Incorrect archived page inventory")
    for old in archived:
        require(by_id[old["superseded_by_asset_id"]]["previous_source_id"] == old["id"],
                f"{old['id']}: broken active source reference")
    actual = {p.relative_to(ROOT).as_posix()
              for p in (ROOT / "assets/originals").rglob("*") if p.is_file()}
    require(actual == {a["path"] for a in sources}, "Unregistered or missing originals")
    require(sum(a["usage"] == "selectable-boat" for a in assets) == 7,
            "Expected exactly seven selectable boats")
    require(sum(a["usage"] == "boat-room-selectable-equipment" for a in assets) == 28,
            "Expected exactly 28 equipment parts")
    require({a["original_filename"] for a in assets if a["usage"] == "scene-background"}
            == {"lake-background.png", "boat-room-background.png", "celebration-background.png"},
            "Incorrect background inventory")
    print("PASS: 155 active assets and 5 archived originals; hashes, PNG CRC/image streams,")
    print("dimensions, inventories, artwork pairs and source revision chains verified.")


if __name__ == "__main__":
    main()
