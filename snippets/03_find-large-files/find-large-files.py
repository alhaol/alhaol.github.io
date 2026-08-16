#!/usr/bin/env python3
"""List files in a directory over a given size threshold (bytes)."""
import sys
from pathlib import Path

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: find-large-files.py <dir> <min_bytes>")
    root = Path(sys.argv[1]).resolve()
    try:
        threshold = int(sys.argv[2])
    except ValueError:
        sys.exit("min_bytes must be an integer")
    if not root.is_dir():
        sys.exit(f"not a directory: {root}")
    for p in sorted(root.rglob("*")):
        if p.is_file() and p.stat().st_size >= threshold:
            print(f"{p.stat().st_size:>12}  {p}")
