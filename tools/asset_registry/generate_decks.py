#!/usr/bin/env python3
"""Regenerate only the canonical Deck/Card projection."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from decks import build_decks


def git(root: Path, *args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=root, check=True, text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    ).stdout.strip()


def tracked_paths(root: Path, path: str) -> set[str]:
    payload = subprocess.run(
        ["git", "ls-tree", "-r", "-z", "--name-only", "HEAD", "--", path],
        cwd=root, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    ).stdout
    return {item.decode("utf-8") for item in payload.split(b"\0") if item}


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main() -> int:
    root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel"))
    config = json.loads((root / "tools/asset_registry/config.json").read_text(encoding="utf-8"))
    commit = git(root, "rev-parse", "HEAD")
    tracked = tracked_paths(root, config["deckRoot"])
    decks, index, problems, cards, town, qa = build_decks(
        root,
        registry_path=config["deckRegistry"],
        deck_root=config["deckRoot"],
        tracked_paths=tracked,
        repo=config["sourceRepo"],
        commit=commit,
    )
    out = root / config["output"] / "decks"
    if out.exists():
        for path in out.glob("*.json"):
            path.unlink()
    write_json(out / "index.json", index)
    write_json(out / "town.json", town)
    for deck in decks:
        write_json(out / f"{deck['deckId']}.json", deck)
    (out / "cards.jsonl").write_text(
        "".join(json.dumps(card, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n" for card in cards),
        encoding="utf-8",
    )
    write_json(out / "qa-report.json", qa)
    print(f"generated {len(decks)} decks / {len(cards)} cards / {len(problems)} problems")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
