# Workflow · Browser QA

- Verify exact source/build identity first.
- Use a real browser and real input where the claim is about runtime behavior.
- Record browser/version/start URL and exact tested revision.
- Distinguish cold start, interaction, focus/resume, visual state and errors.
- Screenshots must prove a named claim, not merely decorate the report.
- A tool inability to generate true focus loss or another OS event must remain NOT_TESTED unless a human or another valid environment performs it.
- Return results additively. Do not modify gameplay during a pure QA assignment.
