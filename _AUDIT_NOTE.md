# Audit Apply Note — AIMusicSchoolAcademyManager

Source: `_AUDIT/reports/batch_05.md` section 33.

## Original Recommendations
### Missing AI counterparts
- `/student-matching`
- `/retention-risk`
- `/ensemble-assignment`
- `/event-promotion`

### Missing non-AI
- Parent portal, student mobile app, video lesson recording, integrations (smartmusic), digital sheet music, live group video lessons, attendance notifications

### Custom suggestions
- Agentic lesson plan curator; vision-based practice eval; agentic engagement; autonomous ensemble management; digital recital platform; mobile ecosystem

## Implemented
Added three endpoints in `backend/src/routes/ai.js`:
- `POST /api/ai/student-matching`
- `POST /api/ai/retention-risk`
- `POST /api/ai/event-promotion`

Reused `callOpenRouter`, `parseAIJson`, `rateLimiter`, and existing `ai_outputs` table.

## Backlog
| Item | Tag |
|---|---|
| `/ensemble-assignment` | MECHANICAL |
| Parent portal | NEEDS-PRODUCT-DECISION |
| Student mobile app | NEEDS-PRODUCT-DECISION |
| Video lesson recording | NEEDS-CREDS / infrastructure |
| Smartmusic / musictheory.net integration | NEEDS-CREDS |
| Digital sheet music library (DRM) | NEEDS-CREDS |
| Live group video lessons (Zoom) | NEEDS-CREDS |
| Attendance push notifications (SMS/email) | NEEDS-CREDS |
| Vision-based practice evaluation | NEEDS-PRODUCT-DECISION |

## Apply pass 3 (frontend)

**Action:** LEFT-AS-IS — FE already wired.

Verified every backend AI endpoint has a dedicated React page: `AIPracticePlan.jsx`, `AIProgressReport.jsx`, `AIRecitalProgram.jsx`, `AISkillAssessment.jsx`, `AILessonPlan.jsx`, `AIMarketingCampaign.jsx`, `AIScheduleMakeup.jsx`, `AIStudentMatching.jsx`, `AIRetentionRisk.jsx`, `AIEventPromotion.jsx`. All routed in `App.jsx` under `/ai/*`. Pages call `api.post('/ai/...')` via the shared axios client (`src/api.js`) which attaches the JWT from `localStorage.getItem('token')` automatically. Includes the three endpoints added in pass 2 (student-matching, retention-risk, event-promotion).

No FE files modified.

## Apply pass 4 (mechanical backlog)

Implemented the remaining MECHANICAL backlog item.

**Backend** (`backend/src/routes/ai.js`):
- `POST /api/ai/ensemble-assignment` — recommends ensemble placements for candidate students using existing `students`, `ensembles`, `ensemble_members` tables. Reuses `callOpenRouter` + `parseAIJson` + `rateLimiter` + `ai_outputs` log. Adds explicit 503-on-no-`OPENROUTER_API_KEY` guard.

**Frontend**:
- New page `frontend/src/pages/AIEnsembleAssignment.jsx` (matches existing AI page style, uses shared `api` axios client + `AIOutput` component).
- Route added in `App.jsx` at `/ai/ensemble-assignment`.
- Sidebar entry added in `Sidebar.jsx` AI Tools group.

**Smoke test:** Created/seeded `music_school` DB; started backend on :4001; logged in admin@musicschool.com; `POST /api/ai/ensemble-assignment` returned HTTP 200. Server cleaned up.

## Apply pass 5 (all backlog)

Promoted vision-based practice eval (PRODUCT-DECISION) to a text-stub implementation; added a parent portal *content* generator (PRODUCT-DECISION).

**Backend** (`backend/src/routes/ai.js`, reuses `callOpenRouter` + `parseAIJson` + `rateLimiter`; both 503 when `OPENROUTER_API_KEY` missing):
- `POST /api/ai/practice-evaluation` — PRODUCT-DECISION: text/transcript-based stub. A real vision/audio practice evaluator would need multimodal model + storage; this endpoint accepts self-reported `notes` and/or `recording_transcript` and produces structured feedback. Prompt + persistence reusable when vision pipeline is wired.
- `POST /api/ai/parent-summary` — PRODUCT-DECISION: produces parent-portal *digest content* (not the multi-page UI/auth surface); pulls 30d of practice / lessons / grades.

**Frontend**:
- New pages `frontend/src/pages/AIPracticeEvaluation.jsx` and `AIParentSummary.jsx` (match existing AI page style + AIOutput).
- Routes added in `App.jsx` at `/ai/practice-evaluation` and `/ai/parent-summary`.
- Sidebar entries added in `Sidebar.jsx`.

**Smoke test:** Started backend on port 4113 with `OPENROUTER_API_KEY=""`; login admin@musicschool.com/admin123 → 200; both new endpoints → 503 with `missing: OPENROUTER_API_KEY`. Server cleaned up.

Backlog updated:
- Vision-based practice eval → done as text/transcript stub (vision wiring deferred; NEEDS-CREDS for hosted multimodal).
- Parent portal → content endpoint done; multi-page portal UI still NEEDS-PRODUCT-DECISION.
- Remaining: SmartMusic / Zoom / SMS / sheet-music DRM integrations (NEEDS-CREDS); student mobile app (NEEDS-PRODUCT-DECISION).
