# Handoff: Voice Agent Prompt Engineering

## Goal
Compare the Ahmad ElevenLabs sales agent prompt against Anthropic's official prompt engineering documentation, identify gaps, and prepare fixes.

## Current Progress

### Completed
- [x] Fetched Anthropic official prompt engineering docs (https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) — full 805-line capture written to `prompt-engineering-anthropic.md`
- [x] Extracted all 45 techniques, 19 warnings, 36 recommendations from source
- [x] Produced v1 comparison (`prompt-comparison.json`) — initial but incomplete (only caught 22% of techniques)
- [x] Identified v1 failed — comparison agent missed 78% of techniques
- [x] Produced VERIFICATION_REPORT.md documenting the gap
- [x] Produced v2 comprehensive comparison (`prompt-comparison-v2.json`, 35KB) — covers ALL 45 techniques with honest scoring across 12 dimensions

### Files Produced
| File | Size | Purpose |
|---|---|---|
| `prompt-engineering-anthropic.md` | 46KB | Full Anthropic doc capture |
| `prompt-comparison.json` | 15KB | v1 comparison (incomplete) |
| `prompt-comparison-v2.json` | 35KB | v2 comprehensive comparison |
| `VERIFICATION_REPORT.md` | 11KB | Audit of v1 accuracy |
| `verification-result.json` | 3KB | Machine-readable v1 audit verdict |

### Workflow Failures
- Multiple Workflow runs failed due to `ReferenceError: Cannot access 'SCHEMA_NAME' before initialization` — the Workflow script parser hoists `const` declarations but the schemas were referenced before their definition in the script. The fix: declare all schemas at the TOP of the script, before any `await agent()` calls. This was ultimately worked around by doing the comparison directly in the main context instead of via Workflow.

## What the Analysis Found

### Dimension Scores (v2, 12 dimensions)
| Dimension | Score | Notes |
|---|---|---|
| Lead Capture | 9/10 | Best-developed section |
| Greeting | 8/10 | Strong but no English fallback |
| Objection Handling | 7/10 | Rigid scripts, no meta-guidance |
| Closing | 7/10 | Binary (book OR lead), no soft-close |
| Tool Usage | 7/10 | Good pre-call checklist |
| Language Rules | 6/10 | Excellent content, DRY violations |
| Guardrails | 6/10 | 11 NEVER rules violate Anthropic |
| Anti-Overengineering | 6/10 | Implicitly constrained |
| Examples Diversity | 6/10 | 5 examples, all identical pattern |
| Hallucination Prevention | 5/10 | Only "NEVER fabricate" guard |
| Effort Configuration | 5/10 | temp=0.0 and max_tokens=500 not documented |
| Self-Verification | 4/10 | BIGGEST GAP — only pre-action checks |

### Top 3 Critical Fixes
1. **REMOVE `<prefill>`** — Anthropic explicitly warns against prefilled assistant messages on Claude 4.6+ models. The `<prefill>` section is a direct documented violation.
2. **ADD `<verification>` block** — `<precognition>` exists (pre-action) but Anthropic specifically recommends "Before you finish, verify your answer against [criteria]" as a POST-action step. This is entirely absent.
3. **REFRAME 11 NEVER rules as positive directives** — Anthropic's core principle: "tell what TO do, not what NOT to do." The guardrails section is 50% negative framing.

### Other Key Gaps
- No hallucination guard beyond "NEVER fabricate slot availability" — prices/services stated as facts without grounding
- DRY violations: masculine verbs, PKT/UTC, times-as-words each appear 3x
- 5 examples all follow identical pattern (user says X → single reply) — missing: interruption, language switch, wrong format, tool error
- `temperature=0.0` and `max_tokens=500` set externally but not documented in prompt body
- No reversibility guidance for `calcom_create_booking` (irreversible action)
- `<evaluation>` metrics defined but not connected to specific prompt behaviors

## What WORKED
- Doing the v2 comparison directly in main context (no Workflow) — avoided the schema hoisting bug entirely
- Reading the full Anthropic markdown source before writing the comparison — ensured accuracy
- Breaking into 12 dimensions (vs v1's 7) — surfaced 5 missing dimensions the v1 missed

## What DIDN'T WORK
- Workflow runs for comparison agents — `ReferenceError` bug in workflow script parser (schemas declared after use)
- Verification workflow got stuck in Phase 2 — "[Request interrupted by user]" propagated into agent chain from earlier interrupted tool call in this same session

## Next Steps

### PRIORITY 1 (do now)
1. **Pull current Ahmad agent config from ElevenLabs** — `elevenlabs agents list` or `el agents list` to find the agent, then `el agents get <id>` to fetch current prompt. User explicitly requested this before implementing fixes but interrupted the check.
2. **Implement the 3 critical fixes** in order: remove `<prefill>`, add `<verification>`, reframe NEVER rules
3. **Push to ElevenLabs** with `el agents update <id> --prompt "$(cat fixed-prompt.md)"`

### PRIORITY 2 (cleanup)
4. Consolidate DRY violations (masculine verbs, PKT/UTC, times-as-words → single `<language_rules>` block)
5. Expand examples to 6-8 with diverse patterns
6. Document `temperature=0.0` and `max_tokens=500` in prompt body
7. Add soft-close option for borderline customers

### PRIORITY 3 (refinement)
8. Add `investigate_before_answering` directive for hallucination prevention
9. Connect `<evaluation>` metrics to specific behaviors
10. Add reversibility guidance for `calcom_create_booking`

## Key Files
- `D:\work\car-wala\prompt-comparison-v2.json` — full analysis (35KB)
- `D:\work\car-wala\prompt-engineering-anthropic.md` — Anthropic source (46KB)
- `D:\work\car-wala\VERIFICATION_REPORT.md` — v1 audit

## Context for Next Session
- ElevenLabs CLI commands: `elevenlabs agents list`, `el agents get <id>`, `el agents update <id> --prompt "..."`
- The `calcom_` tool eventTypeIds are: Silver=5077822, Gold=5077821, Platinum=5077823, Deep=5078476, Diamond=5078508
- PKT = UTC + 5
- Pakistani phone: 11 digits starting 03XX
- The agent is named "Ahmad" in ElevenLabs
