import assert from "node:assert/strict";
import { SAFE_READ_POLICY, validateKfbBriefing } from "./briefing-contract.v1.mjs";

const HEAD = "1234567890abcdef1234567890abcdef12345678";

function base(surface = "WEB_GITHUB") {
  return {
    workflow: "EXAMPLE-01",
    status: "ACTIVE",
    hubUrl: "https://kfb-production-control.frizzlebob.chatgpt.site/briefings/example",
    owner: "georg-doc/kayfabizarro",
    outcome: "One bounded useful result",
    doneWhen: ["one deterministic check passes"],
    returnTarget: "skills/chat/workflows/EXAMPLE/RETURN.md",
    execution: {
      surface,
      model: surface === "CLAUDE_DESIGN" ? "Opus" : "GPT",
      reasoning: "High",
      role: "bounded production slice"
    },
    sourceFallback: {
      kind: "github",
      repository: "georg-doc/kayfabizarro",
      head: HEAD,
      path: "skills/chat/workflows/EXAMPLE/START_HERE.md"
    }
  };
}

const cases = [
  ["valid Web/GitHub briefing", () => base(), true],
  ["valid Claude briefing with GitHub fallback", () => base("CLAUDE_DESIGN"), true],
  ["valid Claude briefing with complete copy-text fallback", () => {
    const b = base("CLAUDE_DESIGN");
    b.sourceFallback = { kind: "copy-text", complete: true };
    return b;
  }, true],
  ["Claude Site-only briefing rejected", () => {
    const b = base("CLAUDE_DESIGN");
    delete b.sourceFallback;
    return b;
  }, false],
  ["non-HTTPS active Hub URL rejected", () => {
    const b = base();
    b.hubUrl = "/briefings/example";
    return b;
  }, false],
  ["mutable GitHub fallback rejected", () => {
    const b = base();
    b.sourceFallback.head = "main";
    return b;
  }, false],
  ["valid bounded Work escalation", () => {
    const b = base("WORK_WSA");
    b.workEscalation = {
      missingCapability: "Production-Control server source is unavailable to the Web connector",
      preparedSource: "exact GitHub source and failing request are already pinned",
      forbiddenChanges: "no Hub redesign and no briefing rewrite",
      successCheck: "limit 20 and limit 100 both return",
      stopCondition: "stop on first unrelated failure"
    };
    return b;
  }, true],
  ["Work without escalation record rejected", () => base("WORK_WSA"), false],
  ["Work with non-capability reason rejected", () => {
    const b = base("WORK_WSA");
    b.workEscalation = {
      missingCapability: "none",
      preparedSource: "prepared",
      forbiddenChanges: "none outside query",
      successCheck: "read succeeds",
      stopCondition: "first unrelated failure"
    };
    return b;
  }, false],
  ["active briefing without model rejected", () => {
    const b = base();
    b.execution.model = "";
    return b;
  }, false],
  ["archived historical briefing may remain minimal", () => ({
    workflow: "OLD-01",
    status: "ARCHIVED"
  }), true],
  ["active briefing without doneWhen rejected", () => {
    const b = base();
    b.doneWhen = [];
    return b;
  }, false]
];

let passed = 0;
for (const [name, make, expected] of cases) {
  const result = validateKfbBriefing(make());
  assert.equal(result.ok, expected, `${name}: ${result.errors.join("; ")}`);
  passed += 1;
}

assert.equal(SAFE_READ_POLICY.preferExactWorkflow, true);
assert.equal(SAFE_READ_POLICY.maxUnfilteredLimit, 20);
assert.equal(SAFE_READ_POLICY.maxRecoveryLimit, 20);
assert.match(SAFE_READ_POLICY.broadLimit100Status, /^KNOWN_SERVER_FAILURE_/);
passed += 1;

console.log(`${passed}/${cases.length + 1} PASS · KFB briefing + safe-read contract`);
