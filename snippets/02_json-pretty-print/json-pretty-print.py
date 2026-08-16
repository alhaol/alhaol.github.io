#!/usr/bin/env python3
"""Validate a JSON file and pretty-print it."""
import json
import sys

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: json-pretty-print.py <path>")
    try:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
    except OSError as e:
        sys.exit(f"error: {e}")
    except json.JSONDecodeError as e:
        sys.exit(f"invalid JSON: {e}")
    print(json.dumps(data, indent=2, ensure_ascii=False))
