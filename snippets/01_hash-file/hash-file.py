#!/usr/bin/env python3
"""Print the SHA-256 checksum of a file."""
import hashlib
import sys


def hash_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: hash-file.py <path>")
    try:
        print(hash_file(sys.argv[1]))
    except OSError as e:
        sys.exit(f"error: {e}")
