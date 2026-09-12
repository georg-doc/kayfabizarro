# KFB Asset Librarian v1.1 · OpenAI Responses connector

**Status:** IMPLEMENTATION CANDIDATE  
**Mode:** read-only LLM orchestration over the existing Registry tools

## Decision

Use the OpenAI **Responses API with custom function tools** as the first live LLM slice.

Why this comes before an Apps SDK / remote MCP deployment:

- it binds directly to the already tested provider-neutral `librarian_tools.py` facade;
- it needs no second asset index;
- it can be run locally or behind a private backend without exposing API credentials in the browser;
- the tool-call loop can be tested without a real API key;
- the same six tool contracts can later be exposed through MCP / Apps SDK for a ChatGPT App.

Current OpenAI reference:

- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/api/docs/guides/tools-function-calling

## Implementation

`tools/asset_registry/openai_librarian.py`

The connector exposes only:

- `search_assets`
- `get_asset`
- `get_dependencies`
- `get_rig_facts`
- `find_same_skeleton`
- `export_handoff`

The model never receives the full 12,767-asset catalog as prompt context. It receives tool definitions first and only the Registry results required for the current question.

Search and same-skeleton result payloads are compacted before being returned to the model; detailed facts remain available through `get_asset`, `get_dependencies`, and `get_rig_facts`.

## Safety / owner boundary

The connector instructions require:

- factual asset claims must come from tools;
- candidates remain `candidate-only`;
- exact skeleton-signature overlap is structural evidence, not a retarget guarantee;
- gameplay / donor / artistic suitability remains inference until downstream validation;
- consumer owner boundaries must be preserved;
- no roster / gameplay / asset writes are exposed.

Unknown tool calls fail closed and are returned to the model as tool errors. The local tool facade does not contain write actions.

## API credentials

No API key is stored in the repository or browser.

Live use requires:

```bash
export OPENAI_API_KEY='...'
export OPENAI_MODEL='...'
```

Choose the model explicitly via `OPENAI_MODEL` or `--model`; the repository does not hard-code a model id.

Optional custom endpoint:

```bash
export OPENAI_BASE_URL='https://api.openai.com/v1'
```

## Live CLI

Example:

```bash
python3 tools/asset_registry/openai_librarian.py \
  --model "$OPENAI_MODEL" \
  "Welche drei rigged Modelle wären gute Kandidaten für Combat Arena? Begründe nur mit Registry-Fakten und markiere deine Empfehlung als Inferenz."
```

JSON output including the local tool trace:

```bash
python3 tools/asset_registry/openai_librarian.py \
  --model "$OPENAI_MODEL" \
  --json \
  "Finde Modelle mit demselben Skeleton wie dieses Asset ..."
```

Inspect the function definitions without making a network request:

```bash
python3 tools/asset_registry/openai_librarian.py --print-tools
```

## Tested vs not yet tested

### Tested

- Responses-style function-call parsing
- `function_call_output` continuation using `previous_response_id`
- instructions are repeated on continuation requests
- multiple parallel read-only tool calls in one response
- local tool errors fail closed
- maximum tool-round limit
- compact search result payloads
- existing real Registry/tool tests remain separate and green

### Not yet tested

A **live OpenAI API call** is intentionally not executed in GitHub CI because no API credential is stored in the repository.

The live gate is complete only when an authorized local/private deployment provides `OPENAI_API_KEY` and one end-to-end question successfully performs a real model → tool → model cycle.

## Next after live API gate

If the live Responses slice is satisfactory, expose the same provider-neutral tools through a remote MCP server and package the visual Librarian with the OpenAI Apps SDK. Do not duplicate search/index logic in the app layer.
