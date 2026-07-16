"""A 20-line OKF reader: walk a bundle, split frontmatter, follow links.

Deliberately dependency-light so a workshop participant can run it with nothing
but the standard library. This is the file the workshop embeds on its code slides.
"""
import re
from pathlib import Path


def load_concept(path: Path) -> dict[str, object]:
    """Split a concept file into its YAML frontmatter and markdown body."""
    text = path.read_text(encoding="utf-8")
    meta: dict[str, str] = {}
    body = text
    if text.startswith("---"):
        _, fm, body = text.split("---", 2)
        for line in fm.strip().splitlines():
            if ":" in line:
                key, val = line.split(":", 1)
                meta[key.strip()] = val.strip()
    links = re.findall(r"\[[^\]]+\]\(([^)]+)\)", body)  # [label](target.md)
    return {"path": str(path), "type": meta.get("type", "?"), "links": links}


def load_bundle(root: str) -> list[dict[str, object]]:
    """Every *.md file under root is one concept; the path is its identity."""
    return [load_concept(p) for p in sorted(Path(root).rglob("*.md"))]


if __name__ == "__main__":
    import sys
    for concept in load_bundle(sys.argv[1] if len(sys.argv) > 1 else "okf_sample"):
        print(f"{concept['type']:<16} {concept['path']}  ->  {concept['links']}")
