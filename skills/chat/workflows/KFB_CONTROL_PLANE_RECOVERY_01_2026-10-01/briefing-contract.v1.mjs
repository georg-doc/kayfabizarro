const ACTIVE_STATUSES = new Set(["ACTIVE", "READY", "IN_PROGRESS"]);
const EXECUTION_SURFACES = new Set(["WEB_GITHUB", "CLAUDE_DESIGN", "WORK_WSA", "HUMAN", "NONE"]);

const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const exactHead = (value) => typeof value === "string" && /^[0-9a-f]{40}$/i.test(value);
const httpsUrl = (value) => {
  if (!nonEmpty(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};

export const SAFE_READ_POLICY = Object.freeze({
  preferExactWorkflow: true,
  maxUnfilteredLimit: 20,
  maxRecoveryLimit: 20,
  broadLimit100Status: "KNOWN_SERVER_FAILURE_2026-10-01",
  rule: "Use exact workflow when known and limit <= 20 until the backend file-join/query path is repaired."
});

export function validateKfbBriefing(briefing) {
  const errors = [];

  if (!briefing || typeof briefing !== "object" || Array.isArray(briefing)) {
    return { ok: false, errors: ["briefing must be an object"] };
  }

  if (!nonEmpty(briefing.workflow)) errors.push("workflow is required");
  if (!nonEmpty(briefing.status)) errors.push("status is required");

  const active = ACTIVE_STATUSES.has(briefing.status);
  if (!active) return { ok: errors.length === 0, errors };

  if (!httpsUrl(briefing.hubUrl)) errors.push("active briefing requires an absolute HTTPS hubUrl");
  if (!nonEmpty(briefing.owner)) errors.push("owner is required");
  if (!nonEmpty(briefing.outcome)) errors.push("outcome is required");
  if (!Array.isArray(briefing.doneWhen) || briefing.doneWhen.length === 0 || briefing.doneWhen.some((x) => !nonEmpty(x))) {
    errors.push("doneWhen requires at least one non-empty check");
  }
  if (!nonEmpty(briefing.returnTarget)) errors.push("returnTarget is required");

  const execution = briefing.execution;
  if (!execution || typeof execution !== "object") {
    errors.push("execution metadata is required");
  } else {
    if (!EXECUTION_SURFACES.has(execution.surface)) errors.push("execution.surface is invalid");
    if (!nonEmpty(execution.model)) errors.push("execution.model is required");
    if (!nonEmpty(execution.reasoning)) errors.push("execution.reasoning is required");
    if (!nonEmpty(execution.role)) errors.push("execution.role is required");
  }

  const fallback = briefing.sourceFallback;
  if (!fallback || typeof fallback !== "object") {
    errors.push("active briefing requires sourceFallback");
  } else if (fallback.kind === "github") {
    if (!nonEmpty(fallback.repository) || !fallback.repository.includes("/")) {
      errors.push("github fallback requires repository in owner/name form");
    }
    if (!exactHead(fallback.head)) errors.push("github fallback requires immutable 40-character head");
    if (!nonEmpty(fallback.path)) errors.push("github fallback requires path");
  } else if (fallback.kind === "copy-text") {
    if (fallback.complete !== true) errors.push("copy-text fallback must be marked complete");
  } else {
    errors.push("sourceFallback.kind must be github or copy-text");
  }

  if (execution?.surface === "CLAUDE_DESIGN" && !fallback) {
    errors.push("Claude Design may not depend on a Site-only briefing");
  }

  if (execution?.surface === "WORK_WSA") {
    const escalation = briefing.workEscalation;
    if (!escalation || typeof escalation !== "object") {
      errors.push("WORK_WSA requires workEscalation");
    } else {
      for (const field of ["missingCapability", "preparedSource", "forbiddenChanges", "successCheck", "stopCondition"]) {
        if (!nonEmpty(escalation[field])) errors.push(`workEscalation.${field} is required`);
      }
      if (nonEmpty(escalation.missingCapability) && /^(none|n\/a|unknown)$/i.test(escalation.missingCapability.trim())) {
        errors.push("WORK_WSA requires a concrete missingCapability");
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
