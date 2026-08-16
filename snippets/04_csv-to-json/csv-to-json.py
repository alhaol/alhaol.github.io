#!/usr/bin/env python3
"""Convert a CSV file to a JSON array of objects."""
import csv
import json
import sys

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: csv-to-json.py <path.csv>")
    try:
        with open(sys.argv[1], newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    except OSError as e:
        sys.exit(f"error: {e}")
    print(json.dumps(rows, indent=2, ensure_ascii=False))
