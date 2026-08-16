#!/usr/bin/env python3
"""Count total lines across files matching a glob pattern (relative to cwd)."""
import sys
from pathlib import Path

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: count-lines.py '<glob-pattern>'  (e.g. 'src/**/*.py')")
    total = 0
    for p in Path(".").glob(sys.argv[1]):
        if p.is_file():
            with open(p, "rb") as f:
                total += sum(1 for _ in f)
    print(total)
