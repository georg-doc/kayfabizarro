import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from librarian_tools import LibrarianTools
from openai_librarian import (
    LIBRARIAN_INSTRUCTIONS,
    OpenAILibrarian,
    OpenAIHTTPError,
    compact_for_model,
    function_calls,
    openai_function_tools,
    response_text,
)


class FakeTransport:
    def __init__(self, responses):
        self.responses = list(responses)
        self.payloads = []

    def create(self, payload):
        self.payloads.append(payload)
        if not self.responses:
            raise AssertionError("unexpected extra Responses API call")
        return self.responses.pop(0)


class OpenAILibrarianTests(unittest.TestCase):
    def setUp(self):
        manifest = {"sourceRepo": "georg-doc/kayfabizarro", "sourceCommit": "abc123"}
        profiles = {
            "animation-lab": {
                "displayName": "Animation Lab",
                "selectionStatus": "candidate-only",
                "allowedKinds": ["model-3d"],
                "ownerBoundary": "Animation Lab owns compatibility.",
                "requiredDownstreamValidation": ["visual playback"],
            },
            "combat-arena": {
                "displayName": "Combat Arena",
                "selectionStatus": "candidate-only",
                "allowedKinds": ["model-3d", "image-2d", "audio"],
                "ownerBoundary": "Combat Arena owns roster acceptance.",
                "requiredDownstreamValidation": ["arena playtest"],
            },
        }
        self.asset_id = "media/3D_Assets/Test/Hero.glb"
        records = [{
            "assetId": self.asset_id,
            "name": "Hero",
            "path": self.asset_id,
            "kind": "model-3d",
            "format": "glb",
            "packId": "test",
            "collectionPath": "Heroes",
            "dependencyStatus": "complete",
            "source": {
                "rawPinned": "https://raw.example/abc123/Hero.glb",
                "rawLatest": "https://raw.example/main/Hero.glb",
            },
            "relations": {"dependencies": [{"role": "image", "path": "texture.png", "exists": True}]},
            "rigFacts": {
                "parseStatus": "ok",
                "hasSkin": True,
                "jointCount": 3,
                "jointNames": ["Hand", "Hip", "Root"],
                "animationCount": 1,
                "animationClips": [{"name": "Walk"}],
                "skeletonSignatures": ["sig-1"],
            },
        }]
        self.tools = LibrarianTools.from_data(manifest, records, profiles)

    def test_function_tool_surface_is_exactly_six_read_only_tools(self):
        tools = openai_function_tools()
        self.assertEqual(
            [tool["name"] for tool in tools],
            [
                "search_assets",
                "get_asset",
                "get_dependencies",
                "get_rig_facts",
                "find_same_skeleton",
                "export_handoff",
            ],
        )
        self.assertTrue(all(tool["type"] == "function" for tool in tools))
        self.assertNotIn("write", json.dumps(tools).lower())
        self.assertNotIn("delete_asset", json.dumps(tools))

    def test_tool_call_loop_uses_previous_response_and_function_output(self):
        transport = FakeTransport([
            {
                "id": "resp_1",
                "output": [{
                    "type": "function_call",
                    "call_id": "call_1",
                    "name": "search_assets",
                    "arguments": json.dumps({
                        "query": "Hero",
                        "filters": {"kind": "model-3d", "rigged": "yes"},
                        "consumer_id": "animation-lab",
                        "limit": 3,
                    }),
                }],
            },
            {
                "id": "resp_2",
                "output": [{
                    "type": "message",
                    "content": [{"type": "output_text", "text": "Hero is a candidate; Animation Lab still owns compatibility."}],
                }],
            },
        ])
        assistant = OpenAILibrarian(tools=self.tools, transport=transport, model="test-model")
        answer = assistant.ask("Find a rigged hero")

        self.assertIn("candidate", answer.text)
        self.assertEqual(answer.response_id, "resp_2")
        self.assertEqual(answer.rounds, 1)
        self.assertEqual(answer.tool_trace[0]["tool"], "search_assets")
        self.assertEqual(len(transport.payloads), 2)

        first, second = transport.payloads
        self.assertEqual(first["input"], "Find a rigged hero")
        self.assertNotIn(self.asset_id, json.dumps(first))
        self.assertEqual(second["previous_response_id"], "resp_1")
        self.assertEqual(second["instructions"], LIBRARIAN_INSTRUCTIONS)
        self.assertEqual(second["input"][0]["type"], "function_call_output")
        self.assertEqual(second["input"][0]["call_id"], "call_1")
        tool_output = json.loads(second["input"][0]["output"])
        self.assertEqual(tool_output["selectionStatus"], "candidate-only")
        self.assertEqual(tool_output["assets"][0]["assetId"], self.asset_id)
        self.assertNotIn("jointNames", json.dumps(tool_output))

    def test_parallel_function_calls_are_returned_in_one_continuation(self):
        transport = FakeTransport([
            {
                "id": "resp_a",
                "output": [
                    {"type": "function_call", "call_id": "rig", "name": "get_rig_facts", "arguments": json.dumps({"asset_id": self.asset_id})},
                    {"type": "function_call", "call_id": "deps", "name": "get_dependencies", "arguments": json.dumps({"asset_id": self.asset_id})},
                ],
            },
            {
                "id": "resp_b",
                "output_text": "The file has a 3-joint rig and one explicit texture dependency.",
                "output": [],
            },
        ])
        answer = OpenAILibrarian(tools=self.tools, transport=transport, model="test-model").ask("Inspect Hero")
        self.assertEqual(answer.rounds, 1)
        self.assertEqual([row["tool"] for row in answer.tool_trace], ["get_rig_facts", "get_dependencies"])
        continuation = transport.payloads[1]
        self.assertEqual([item["call_id"] for item in continuation["input"]], ["rig", "deps"])

    def test_invalid_tool_request_is_reported_to_model_not_executed_as_write(self):
        transport = FakeTransport([
            {
                "id": "resp_bad",
                "output": [{
                    "type": "function_call",
                    "call_id": "bad",
                    "name": "delete_asset",
                    "arguments": "{}",
                }],
            },
            {"id": "resp_final", "output_text": "That action is unavailable.", "output": []},
        ])
        answer = OpenAILibrarian(tools=self.tools, transport=transport, model="test-model").ask("Delete Hero")
        self.assertEqual(answer.text, "That action is unavailable.")
        self.assertFalse(answer.tool_trace[0]["ok"])
        tool_error = json.loads(transport.payloads[1]["input"][0]["output"])
        self.assertEqual(tool_error["schema"], "kfb.asset-librarian-tool-error.v1")
        self.assertIn("unknown tool", tool_error["error"])

    def test_tool_round_limit_fails_closed(self):
        transport = FakeTransport([
            {"id": "one", "output": [{"type": "function_call", "call_id": "a", "name": "get_asset", "arguments": json.dumps({"asset_id": self.asset_id})}]},
            {"id": "two", "output": [{"type": "function_call", "call_id": "b", "name": "get_asset", "arguments": json.dumps({"asset_id": self.asset_id})}]},
        ])
        assistant = OpenAILibrarian(tools=self.tools, transport=transport, model="test-model", max_tool_rounds=1)
        with self.assertRaises(OpenAIHTTPError):
            assistant.ask("Keep calling tools")

    def test_response_helpers_accept_rest_response_shape(self):
        response = {
            "output": [
                {"type": "function_call", "call_id": "c", "name": "get_asset", "arguments": "{}"},
                {"type": "message", "content": [{"type": "output_text", "text": "done"}]},
            ]
        }
        self.assertEqual(function_calls(response)[0]["name"], "get_asset")
        self.assertEqual(response_text(response), "done")

    def test_compact_search_output_keeps_evidence_but_drops_large_rig_arrays(self):
        raw = self.tools.search_assets("Hero", filters={"kind": "model-3d"}, limit=1)
        compact = compact_for_model("search_assets", raw)
        asset = compact["assets"][0]
        self.assertEqual(asset["rigSummary"]["jointCount"], 3)
        self.assertEqual(asset["rigSummary"]["clipNames"], ["Walk"])
        self.assertNotIn("jointNames", json.dumps(asset))
        self.assertEqual(asset["rawPinned"], "https://raw.example/abc123/Hero.glb")


if __name__ == "__main__":
    unittest.main()
