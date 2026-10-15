#!/usr/bin/env python3
"""REVIEW ONLY. Candidate R3 checker-side guard. Never imported by active R2 checker automatically.
Usage: python3 R3_CHECKER_PROPOSAL.py <OPENERS_R3_CANDIDATES.json> <sample_assignments.json>
sample_assignments: [{"line_no": 1, "id":"OPR3_001", "class":"IDEA", "triplet":"..."}].
Human editorial PASS remains separate; mechanically valid != true narration.
"""
import json, sys
def validate(rows, candidates, max_chars=4999):
    pool = {c["id"]: c for c in candidates["candidates"]}
    seen_literals = set()
    family_last = {}
    results = []
    for item in rows:
        idx = int(item["line_no"])
        c = pool[item["id"]]
        literal = c["literal"]
        problems = []
        if literal in seen_literals:
            problems.append("DUPLICATE_LITERAL")
        if item["class"] not in c["cardClassAllowed"]:
            problems.append("SEMANTIC_CLASS")
        last = family_last.get(c["family"])
        if last is not None and idx-last < 10:
            problems.append("FAMILY_GAP")
        if c["risk"] == "HIGH":
            problems.append("ATTRIBUTION_REVIEW_REQUIRED")
        if literal + " " + item["triplet"] != item.get("spokenText", literal + " " + item["triplet"]):
            problems.append("NONCANONICAL_CONCATENATION")
        if len(literal) + 1 != c["totalOpenerOverhead"]:
            problems.append("BAD_COST")
        results.append({"line_no":idx, "id":c["id"], "pass":not problems, "problems":problems})
        seen_literals.add(literal)
        family_last[c["family"]] = idx
    return results
if __name__ == "__main__":
    c = json.load(open(sys.argv[1], encoding="utf-8"))
    rows = json.load(open(sys.argv[2], encoding="utf-8"))
    result = validate(rows,c)
    print(json.dumps(result,indent=2))
    sys.exit(int(any(not r["pass"] for r in result)))
