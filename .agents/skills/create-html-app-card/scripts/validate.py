#!/usr/bin/env python3
"""
Validation gate for a freshly rendered wisdom-card app at apps/<slug>/index.html.

Runs the standard site checks plus card-deck-specific ones:
  1. Slug is not already taken (links.json has no entry).
  2. Generated HTML contains the required login overlay + _login() handler.
  3. Favicon path is the project-standard ../../assets/ibrahim-image-circle.png.
  4. No raw {{PLACEHOLDER}} tokens leaked through from the template.
  5. The DECK data object is present and wired (const DECK, cards, groups).
  6. DECK.stateKey looks unique (mentions the slug) so it won't collide with
     another card deck's localStorage.

Exit 0 = pass, exit 1 = at least one check failed. Failures are printed to stdout
so the calling skill can surface them to the user verbatim.

Usage: python validate.py <repo_root> <slug>
"""
import json
import re
import sys
from pathlib import Path


def main(repo_root: Path, slug: str) -> int:
    failures: list[str] = []
    app_dir = repo_root / "apps" / slug
    app_html = app_dir / "index.html"
    links_json = repo_root / "links" / "links.json"

    # 1. Slug uniqueness — links.json
    if links_json.exists():
        existing = {entry.get("slug") for entry in json.loads(links_json.read_text(encoding="utf-8"))}
        if slug in existing:
            failures.append(f"slug '{slug}' already exists in links/links.json")

    if not app_html.exists():
        failures.append(f"expected file not found: {app_html}")
        _report(failures)
        return 1

    html = app_html.read_text(encoding="utf-8")

    # 2. Login overlay
    if 'id="loginView"' not in html:
        failures.append('missing <div id="loginView"> — login overlay must be present (see CLAUDE.md)')
    if "function _login()" not in html:
        failures.append("missing function _login() — login handler must be present (see CLAUDE.md)")
    if "ibrahimwin" not in html:
        failures.append("login credentials check missing — _login() should validate against ibrahim / ibrahimwin")

    # 3. Favicon
    if "../../assets/ibrahim-image-circle.png" not in html:
        failures.append("favicon path must be ../../assets/ibrahim-image-circle.png (relative from apps/<slug>/)")

    # 4. Placeholder leakage
    leaks = re.findall(r"\{\{[A-Z_]+\}\}", html)
    if leaks:
        failures.append(f"unsubstituted template placeholders left in output: {sorted(set(leaks))}")

    # 5. Deck wiring
    if "const DECK" not in html:
        failures.append("DECK data object missing — {{DECK_DATA}} should define `const DECK = {...}`")
    for field in ("cards", "groups", "rootName", "stateKey"):
        if re.search(r"\b" + field + r"\s*:", html) is None:
            failures.append(f"DECK is missing the `{field}` field")

    # 6. stateKey collision guard — should reference the slug so two decks don't
    #    share localStorage.
    m = re.search(r'stateKey\s*:\s*["\']([^"\']+)["\']', html)
    if m and slug not in m.group(1):
        failures.append(
            f"DECK.stateKey '{m.group(1)}' does not contain the slug '{slug}' — "
            "use a slug-based key (e.g. cardDeck_" + slug + "_v1) to avoid localStorage collisions"
        )

    _report(failures)
    return 1 if failures else 0


def _report(failures: list[str]) -> None:
    if failures:
        print("VALIDATION FAILED:")
        for f in failures:
            print(f"  - {f}")
    else:
        print("VALIDATION PASSED")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: validate.py <repo_root> <slug>")
        sys.exit(2)
    sys.exit(main(Path(sys.argv[1]).resolve(), sys.argv[2]))
