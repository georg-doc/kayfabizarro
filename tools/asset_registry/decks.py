"""Data-only projection of the canonical KFB deck registry.

``media/kfb/index.json`` and its referenced PDF/card JSON pairs remain the
owners. This adapter measures PDF pages, normalizes the observed card schemas
in memory, and emits searchable Deck/Card projections without changing source
files.
"""
from __future__ import annotations

import json
import math
import posixpath
import re
from pathlib import Path
from urllib.parse import quote

PREAPPROVED_GAME_USE = {
    "forget_utopia",
    "ignore_dystopia",
    "embrace_protopia",
    "frizzlebob_s_mission_control",
}


def _raw_url(repo: str, ref: str, path: str) -> str:
    return f"https://raw.githubusercontent.com/{repo}/{ref}/{quote(path, safe='/')}"


def _join(root: str, name: str) -> str:
    return posixpath.normpath(posixpath.join(root.rstrip('/'), name))


def _problem(kind: str, *, deck_id: str | None, path: str | None, detail: str) -> dict:
    token = deck_id or path or detail
    return {
        "problemId": f"{kind}:{token}",
        "type": kind,
        "deckId": deck_id,
        "assetPath": path,
        "detail": detail,
        "provenance": "manifest-explicit",
    }


def _resolved_path(path: str, tracked_paths: set[str]) -> str | None:
    if path in tracked_paths:
        return path
    variants = {path.replace("'", "’"), path.replace("’", "'")}
    return next((candidate for candidate in sorted(variants) if candidate in tracked_paths), None)


def _pdf_page_count(path: Path) -> int | None:
    """Read the root /Pages count using only the Python standard library."""
    try:
        data = path.read_bytes()
    except OSError:
        return None
    counts = [
        int(value)
        for value in re.findall(
            rb"/Type\s*/Pages\b(?:(?!endobj).){0,4096}?/Count\s+(\d+)",
            data,
            re.DOTALL,
        )
    ]
    if counts:
        return max(counts)
    leaves = len(re.findall(rb"/Type\s*/Page\b", data))
    return leaves or None


def _load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def _normalized_cards(document: dict) -> tuple[list[dict], str]:
    raw_cards = document.get("cards") if isinstance(document.get("cards"), list) else []
    if not raw_cards:
        return [], "empty"
    has_card_number = all(isinstance(card, dict) and card.get("cardNumber") is not None for card in raw_cards)
    has_num = all(isinstance(card, dict) and card.get("num") is not None for card in raw_cards)
    has_card_name = all(isinstance(card, dict) and card.get("cardName") is not None for card in raw_cards)
    has_name = all(isinstance(card, dict) and card.get("name") is not None for card in raw_cards)
    if has_card_number and has_card_name:
        status = "canonical"
    elif has_num and has_name:
        status = "normalized-num-name"
    elif has_name:
        status = "normalized-name-only"
    else:
        status = "normalized-mixed"

    cards: list[dict] = []
    for position, raw in enumerate(raw_cards, 1):
        raw = raw if isinstance(raw, dict) else {}
        candidate = raw.get("cardNumber", raw.get("num", position))
        try:
            number = int(candidate)
        except (TypeError, ValueError):
            number = position
        cards.append(
            {
                "cardNumber": number,
                "cardName": str(raw.get("cardName") or raw.get("name") or f"Card {number}"),
                "lore": str(raw.get("lore") or ""),
                "power": str(raw.get("power") or ""),
                "grade": raw.get("grade"),
                "sourcePosition": position,
            }
        )
    return cards, status


def _list(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if item not in (None, "")]
    if value in (None, ""):
        return []
    return [str(value)]


def _game_mode(deck_id: str, raw: dict, document: dict) -> str:
    text = " ".join([deck_id, str(raw.get("title") or ""), str(document.get("deckType") or "")]).lower()
    return "MED" if "medkayfab" in text or "medical" in text or "medicine" in text else "KFB"


def build_decks(
    repo_root: Path,
    *,
    registry_path: str,
    deck_root: str,
    tracked_paths: set[str],
    repo: str,
    commit: str,
) -> tuple[list[dict], dict, list[dict], list[dict], dict, dict]:
    source = json.loads((repo_root / registry_path).read_text(encoding="utf-8"))
    source_schema = source.get("schema")
    records: list[dict] = []
    card_catalog: list[dict] = []
    problems: list[dict] = []
    seen: set[str] = set()
    set_by_deck = {
        deck_id: item.get("setId")
        for item in source.get("sets", [])
        for deck_id in item.get("decks", [])
    }

    for raw in source.get("decks", []):
        deck_id = raw.get("packId")
        if not deck_id:
            problems.append(_problem("DECK_ID_MISSING", deck_id=None, path=registry_path, detail="deck entry has no packId"))
            continue
        if deck_id in seen:
            problems.append(_problem("DUPLICATE_DECK_ID", deck_id=deck_id, path=registry_path, detail="duplicate packId in source deck registry"))
            continue
        seen.add(deck_id)

        resolved: dict[str, str | None] = {}
        representations = {"pdf": [], "cardTextJson": [], "web": [], "images": []}
        for field, bucket, problem_type in (
            ("pdf", "pdf", "MISSING_DECK_PDF"),
            ("data", "cardTextJson", "MISSING_DECK_DATA"),
        ):
            name = raw.get(field)
            if not name:
                resolved[field] = None
                continue
            declared = _join(deck_root, name)
            actual = _resolved_path(declared, tracked_paths)
            resolved[field] = actual
            representations[bucket].append(
                {
                    "path": actual or declared,
                    "declaredPath": declared,
                    "exists": actual is not None,
                    "sourceField": field,
                    "provenance": "manifest-explicit",
                    "rawLatest": _raw_url(repo, "main", actual or declared),
                    "rawPinned": _raw_url(repo, commit, actual or declared),
                }
            )
            if actual is None:
                problems.append(_problem(problem_type, deck_id=deck_id, path=declared, detail=f"{field} referenced by {registry_path} is not tracked"))
            elif actual != declared:
                problems.append(_problem("DECK_PATH_NORMALIZED", deck_id=deck_id, path=declared, detail=f"manifest path resolves to tracked file {actual}"))

        document = _load_json(repo_root / resolved["data"]) if resolved.get("data") else {}
        cards, schema_status = _normalized_cards(document)
        pdf_pages = _pdf_page_count(repo_root / resolved["pdf"]) if resolved.get("pdf") else None
        card_count = len(cards)
        card_sheets = math.ceil(card_count / 4) if card_count else 0
        measured_offset = pdf_pages - card_sheets if pdf_pages is not None and card_count else None
        mapping_verified = measured_offset in {0, 1}
        cover_offset = measured_offset if mapping_verified else raw.get("coverOffset")
        cover_status = "measured" if mapping_verified else "unverified"
        for card in cards:
            number = card["cardNumber"]
            page = int(cover_offset) + 1 + ((number - 1) // 4) if mapping_verified else None
            quadrant = (number - 1) % 4 if mapping_verified else None
            card.update({"deckId": deck_id, "page": page, "quadrant": quadrant, "mappingVerified": mapping_verified})
            card_catalog.append(
                {
                    "schema": "kfb.card-ref/1",
                    "deckId": deck_id,
                    "deckTitle": raw.get("title"),
                    "cardNumber": number,
                    "cardName": card["cardName"],
                    "lore": card["lore"],
                    "page": page,
                    "quadrant": quadrant,
                    "pdf": raw.get("pdf"),
                    "data": raw.get("data"),
                    "mappingVerified": mapping_verified,
                }
            )

        tags = sorted(set(_list(document.get("hashtags")) + _list(document.get("deckFunction")) + _list(document.get("genre"))))
        set_id = set_by_deck.get(deck_id)
        game_use = "allowed" if deck_id in PREAPPROVED_GAME_USE else "review"
        record = {
            "schema": "kfb.asset-deck.v2",
            "deckId": deck_id,
            "title": raw.get("title") or document.get("deckTitle") or deck_id,
            "root": deck_root,
            "groupingStatus": "explicit",
            "gameMode": _game_mode(deck_id, raw, document),
            "deckType": document.get("deckType") or "Unclassified",
            "role": raw.get("role") or "unassigned",
            "sets": [set_id] if set_id else [],
            "bundleSuggestion": document.get("bundleSuggestion") or document.get("bundle") or None,
            "cardCount": card_count,
            "pdfPages": pdf_pages,
            "indexPages": raw.get("pages"),
            "coverOffset": cover_offset,
            "coverOffsetStatus": cover_status,
            "mappingStatus": "verified" if mapping_verified else "unverified",
            "representations": representations,
            "tags": tags,
            "schemaStatus": schema_status,
            "gameUse": game_use,
            "cards": cards,
            "sourceRegistry": {"path": registry_path, "schema": source_schema, "provenance": "manifest-explicit"},
            "sourceCommit": commit,
        }
        records.append(record)

    records.sort(key=lambda deck: deck["deckId"])
    card_catalog.sort(key=lambda card: (card["deckId"], card["cardNumber"]))
    problems.sort(key=lambda problem: (problem["type"], problem.get("deckId") or "", problem.get("assetPath") or ""))
    index = {
        "schema": "kfb.asset-deck-index.v2",
        "sourceRegistry": {"path": registry_path, "schema": source_schema, "provenance": "manifest-explicit"},
        "sourceCommit": commit,
        "count": len(records),
        "cardCount": len(card_catalog),
        "cardCatalog": "decks/cards.jsonl",
        "townShard": "decks/town.json",
        "qaReport": "decks/qa-report.json",
        "decks": [
            {key: record[key] for key in ("deckId", "title", "gameMode", "deckType", "role", "sets", "bundleSuggestion", "cardCount", "pdfPages", "coverOffset", "coverOffsetStatus", "mappingStatus", "representations", "tags", "schemaStatus", "gameUse")}
            | {"shard": f"decks/{record['deckId']}.json"}
            for record in records
        ],
        "sets": source.get("sets", []),
        "rules": source.get("rules", []),
    }
    town = {
        "schema": "kfb.town-deck-library/1",
        "sourceCommit": commit,
        "selectionRule": "explicit gameUse=allowed only",
        "decks": [
            {"deckId": record["deckId"], "role": "primary" if record["deckId"] == "frizzlebob_s_mission_control" else record["role"], "gameUse": "allowed"}
            for record in records
            if record["gameUse"] == "allowed"
        ],
    }
    qa = {
        "schema": "kfb.deck-data-qa/1",
        "sourceCommit": commit,
        "deckCount": len(records),
        "cardCount": len(card_catalog),
        "pageCountMismatches": [
            {"deckId": deck["deckId"], "indexPages": deck["indexPages"], "pdfPages": deck["pdfPages"]}
            for deck in records if deck["indexPages"] != deck["pdfPages"]
        ],
        "unverifiedMappings": [deck["deckId"] for deck in records if deck["mappingStatus"] != "verified"],
        "sourceCorrections": [problem for problem in problems if problem["type"] == "DECK_PATH_NORMALIZED"],
    }
    return records, index, problems, card_catalog, town, qa
