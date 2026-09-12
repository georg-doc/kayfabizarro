#!/usr/bin/env python3
"""Minimal OpenAI Responses API connector for KFB Asset Librarian v1.1.

The connector is deliberately thin:
- Registry/search truth stays in librarian_tools.py.
- OpenAI receives only six read-only function tools, never the full catalog.
- API credentials are read from the environment and are never stored here.
- Compatibility/suitability remains a downstream consumer decision.

Live API usage requires OPENAI_API_KEY and an explicit model via --model or
OPENAI_MODEL. The orchestration itself is testable with a fake transport.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Protocol

from librarian_tools import LibrarianToolError, LibrarianTools

DEFAULT_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MAX_TOOL_ROUNDS = 8

LIBRARIAN_INSTRUCTIONS = """You are KFB Asset Librarian, a read-only assistant over the KFB Asset Registry.

Rules:
1. Use the provided tools for factual claims about available assets, paths, RAW URLs, dependencies, rigs, joints, animations, packs, or consumer handoffs. Do not invent Registry facts.
2. Search results are candidates only. Never present a candidate as gameplay-valid, donor-valid, artistically approved, or retarget-compatible unless a receiving consumer has separately validated it.
3. Exact skeleton-signature overlap is structural evidence only. Say so when it matters.
4. Distinguish Registry fact from your inference/recommendation. Explain why a candidate may be worth testing without turning that inference into a fact.
5. Respect consumer ownership boundaries from export_handoff. Do not write rosters, gameplay contracts, measurements, or implementation state.
6. For Frankenstein/donor requests, prefer at least three candidates when the Registry supports that many, because downstream donor measurement still decides fit.
7. If the Registry does not support a requested claim, say what is unknown rather than guessing.
8. Keep answers concise and practical. Answer in the user's language.
"""


class ResponsesTransport(Protocol):
    def create(self, payload: dict[str, Any]) -> dict[str, Any]: ...


class OpenAIHTTPError(RuntimeError):
    pass


class OpenAIResponsesHTTPTransport:
    """Small stdlib-only transport for POST /v1/responses."""

    def __init__(
        self,
        *,
        api_key: str | None = None,
        base_url: str | None = None,
        timeout: float = 120.0,
    ) -> None:
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self.base_url = (base_url or os.environ.get("OPENAI_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
        self.timeout = timeout
        if not self.api_key:
            raise OpenAIHTTPError("OPENAI_API_KEY is required for a live OpenAI request")

    def create(self, payload: dict[str, Any]) -> dict[str, Any]:
        request = urllib.request.Request(
            f"{self.base_url}/responses",
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "kfb-asset-librarian/1.1",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            try:
                detail = json.loads(body)
            except json.JSONDecodeError:
                detail = body
            raise OpenAIHTTPError(f"OpenAI Responses API HTTP {exc.code}: {detail}") from exc
        except urllib.error.URLError as exc:
            raise OpenAIHTTPError(f"OpenAI Responses API connection failed: {exc.reason}") from exc


def openai_function_tools() -> list[dict[str, Any]]:
    """Current Responses API custom-function definitions for the six read-only tools."""
    return [
        {
            "type": "function",
            "name": "search_assets",
            "description": "Search KFB Asset Registry candidates by text, structural metadata, rig/animation facts, and optional receiving consumer. Results are candidate-only.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": ["string", "null"], "description": "Name/path/pack/collection search text, or null for filter-only search."},
                    "filters": {
                        "type": "object",
                        "properties": {
                            "kind": {"type": "string", "enum": ["model-3d", "image-2d", "audio"]},
                            "pack": {"type": "string"},
                            "format": {"type": "string"},
                            "dependencyStatus": {"type": "string", "enum": ["complete", "embedded", "missing", "unresolved"]},
                            "rigged": {"type": "string", "enum": ["yes", "no", "unknown"]},
                            "animated": {"type": "string", "enum": ["yes", "no", "unknown"]},
                            "clip": {"type": "string"},
                            "joint": {"type": "string"},
                            "signature": {"type": "string"},
                        },
                        "additionalProperties": False,
                    },
                    "consumer_id": {"type": ["string", "null"], "description": "Optional receiving consumer profile id."},
                    "limit": {"type": "integer", "minimum": 1, "maximum": 50},
                },
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "get_asset",
            "description": "Get one asset's Registry metadata and structural relations by stable assetId.",
            "parameters": {
                "type": "object",
                "properties": {"asset_id": {"type": "string"}},
                "required": ["asset_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "get_dependencies",
            "description": "Get explicit dependency status and dependency rows for one asset.",
            "parameters": {
                "type": "object",
                "properties": {"asset_id": {"type": "string"}},
                "required": ["asset_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "get_rig_facts",
            "description": "Get structural GLTF/GLB rig and animation facts for one asset. These facts do not prove retarget/gameplay compatibility.",
            "parameters": {
                "type": "object",
                "properties": {"asset_id": {"type": "string"}},
                "required": ["asset_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "find_same_skeleton",
            "description": "Find assets with exact structural skeleton-signature overlap. This is evidence only, not a compatibility decision.",
            "parameters": {
                "type": "object",
                "properties": {
                    "asset_id": {"type": "string"},
                    "limit": {"type": "integer", "minimum": 1, "maximum": 50},
                },
                "required": ["asset_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "export_handoff",
            "description": "Export selected candidates to an existing consumer using kfb.asset-handoff.v1 while preserving the receiving-owner boundary.",
            "parameters": {
                "type": "object",
                "properties": {
                    "consumer_id": {"type": "string"},
                    "asset_ids": {"type": "array", "items": {"type": "string"}, "minItems": 1, "maxItems": 50},
                },
                "required": ["consumer_id", "asset_ids"],
                "additionalProperties": False,
            },
        },
    ]


def _item_value(item: Any, key: str, default: Any = None) -> Any:
    if isinstance(item, dict):
        return item.get(key, default)
    return getattr(item, key, default)


def function_calls(response: dict[str, Any]) -> list[dict[str, Any]]:
    calls: list[dict[str, Any]] = []
    for item in response.get("output", []) or []:
        if _item_value(item, "type") != "function_call":
            continue
        calls.append({
            "call_id": _item_value(item, "call_id"),
            "name": _item_value(item, "name"),
            "arguments": _item_value(item, "arguments", "{}"),
        })
    return calls


def response_text(response: dict[str, Any]) -> str:
    helper = response.get("output_text")
    if isinstance(helper, str) and helper.strip():
        return helper.strip()
    chunks: list[str] = []
    for item in response.get("output", []) or []:
        if _item_value(item, "type") != "message":
            continue
        for content in _item_value(item, "content", []) or []:
            if _item_value(content, "type") == "output_text":
                text = _item_value(content, "text")
                if isinstance(text, str):
                    chunks.append(text)
    return "\n".join(chunks).strip()


def _model_safe_asset(asset: dict[str, Any]) -> dict[str, Any]:
    """Keep search/same-skeleton tool outputs useful without flooding model context."""
    rig = asset.get("rigFacts") or {}
    source = asset.get("source") or {}
    return {
        "assetId": asset.get("assetId"),
        "name": asset.get("name"),
        "path": asset.get("path"),
        "kind": asset.get("kind"),
        "format": asset.get("format"),
        "packId": asset.get("packId"),
        "collectionPath": asset.get("collectionPath"),
        "dependencyStatus": asset.get("dependencyStatus"),
        "rawPinned": source.get("rawPinned"),
        "rigSummary": {
            "parseStatus": rig.get("parseStatus"),
            "hasSkin": rig.get("hasSkin"),
            "jointCount": rig.get("jointCount"),
            "animationCount": rig.get("animationCount"),
            "clipNames": [clip.get("name") for clip in (rig.get("animationClips") or []) if clip.get("name")][:8],
        } if rig else None,
    }


def compact_for_model(tool_name: str, result: dict[str, Any]) -> dict[str, Any]:
    """Trim high-recall tool output only for model transport; source tool result remains unchanged."""
    if tool_name == "search_assets":
        out = dict(result)
        out["assets"] = [_model_safe_asset(asset) for asset in result.get("assets", [])]
        return out
    if tool_name == "find_same_skeleton":
        out = dict(result)
        out["candidates"] = [
            {
                "asset": _model_safe_asset(row.get("asset") or {}),
                "matchingSignatures": row.get("matchingSignatures") or [],
            }
            for row in result.get("candidates", [])
        ]
        return out
    return result


@dataclass
class LibrarianAnswer:
    text: str
    response_id: str | None
    tool_trace: list[dict[str, Any]]
    rounds: int


class OpenAILibrarian:
    def __init__(
        self,
        *,
        tools: LibrarianTools,
        transport: ResponsesTransport,
        model: str,
        instructions: str = LIBRARIAN_INSTRUCTIONS,
        max_tool_rounds: int = DEFAULT_MAX_TOOL_ROUNDS,
    ) -> None:
        if not model:
            raise ValueError("model is required")
        if max_tool_rounds < 1:
            raise ValueError("max_tool_rounds must be >= 1")
        self.tools = tools
        self.transport = transport
        self.model = model
        self.instructions = instructions
        self.max_tool_rounds = max_tool_rounds
        self.function_tools = openai_function_tools()

    def _payload(self, *, input_value: Any, previous_response_id: str | None = None) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": self.model,
            "instructions": self.instructions,
            "input": input_value,
            "tools": self.function_tools,
            "tool_choice": "auto",
            "parallel_tool_calls": True,
        }
        if previous_response_id:
            payload["previous_response_id"] = previous_response_id
        return payload

    def ask(self, question: str) -> LibrarianAnswer:
        question = question.strip()
        if not question:
            raise ValueError("question must not be empty")

        response = self.transport.create(self._payload(input_value=question))
        trace: list[dict[str, Any]] = []

        for round_index in range(self.max_tool_rounds + 1):
            calls = function_calls(response)
            if not calls:
                text = response_text(response)
                if not text:
                    raise OpenAIHTTPError("OpenAI response contained neither function calls nor output text")
                return LibrarianAnswer(
                    text=text,
                    response_id=response.get("id"),
                    tool_trace=trace,
                    rounds=round_index,
                )

            if round_index >= self.max_tool_rounds:
                raise OpenAIHTTPError(f"tool round limit exceeded ({self.max_tool_rounds})")

            outputs: list[dict[str, Any]] = []
            for call in calls:
                name = call.get("name")
                call_id = call.get("call_id")
                try:
                    arguments = json.loads(call.get("arguments") or "{}")
                    if not isinstance(arguments, dict):
                        raise LibrarianToolError("function arguments must decode to a JSON object")
                    raw_result = self.tools.call(name, arguments)
                    model_result = compact_for_model(name, raw_result)
                    trace.append({"tool": name, "arguments": arguments, "ok": True})
                except (json.JSONDecodeError, LibrarianToolError, TypeError, ValueError) as exc:
                    model_result = {
                        "schema": "kfb.asset-librarian-tool-error.v1",
                        "tool": name,
                        "error": str(exc),
                    }
                    trace.append({"tool": name, "ok": False, "error": str(exc)})

                outputs.append({
                    "type": "function_call_output",
                    "call_id": call_id,
                    "output": json.dumps(model_result, ensure_ascii=False, separators=(",", ":")),
                })

            response = self.transport.create(
                self._payload(input_value=outputs, previous_response_id=response.get("id"))
            )

        raise OpenAIHTTPError("unexpected orchestration termination")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ask KFB Asset Librarian through OpenAI Responses API")
    parser.add_argument("question", nargs="?", help="Question for the Librarian")
    parser.add_argument("--model", default=os.environ.get("OPENAI_MODEL"), help="OpenAI model id; or set OPENAI_MODEL")
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--max-tool-rounds", type=int, default=DEFAULT_MAX_TOOL_ROUNDS)
    parser.add_argument("--json", action="store_true", help="Emit answer plus tool trace as JSON")
    parser.add_argument("--print-tools", action="store_true", help="Print the six Responses API function definitions without making an API call")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.print_tools:
        print(json.dumps(openai_function_tools(), ensure_ascii=False, indent=2))
        return 0
    if not args.question:
        print("question is required unless --print-tools is used", file=sys.stderr)
        return 2
    if not args.model:
        print("OpenAI model is required via --model or OPENAI_MODEL", file=sys.stderr)
        return 2

    try:
        tools = LibrarianTools()
        transport = OpenAIResponsesHTTPTransport(base_url=args.base_url)
        assistant = OpenAILibrarian(
            tools=tools,
            transport=transport,
            model=args.model,
            max_tool_rounds=args.max_tool_rounds,
        )
        answer = assistant.ask(args.question)
    except (OpenAIHTTPError, LibrarianToolError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps({
            "text": answer.text,
            "responseId": answer.response_id,
            "rounds": answer.rounds,
            "toolTrace": answer.tool_trace,
        }, ensure_ascii=False, indent=2))
    else:
        print(answer.text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
