# Gaps & Risks — AI Engineering Learning Tracker

This document identifies missing pieces, technical debt, and potential credibility concerns that could hurt this project if scrutinized.

---

## Critical Gaps (Would Block Multi-User Launch)

### 1. **Authentication is Hardcoded — Not Production-Ready**
**Gap:** Credentials are hardcoded in source code (`korpolechandrashekar@gmail.com / learning2024`).

**Why it's a risk:**
- Cannot safely onboard other users
- Credentials visible in GitHub (even though private, it's unsafe practice)
- NextAuth configured but doesn't support signup/password reset
- No user registration flow

**Fix needed before multi-user:**
- Implement real user signup (email verification)
- Add password hashing + reset flows
- Remove hardcoded credentials
- Add role-based access control (admin, learner, mentor)

---

### 2. **Database Schema Assumes Single User (or Hardcoded User)**
**Gap:** All tables have `userId` field, but the app is built for a single hardcoded user.

**Why it's a risk:**
- Migrating from 1 user to many requires careful backfill
- No user management endpoints
- No way to create/delete/update users
- Session management works, but no account management UI

**Fix needed before multi-user:**
- Build user management API routes
- Add account settings page
- Implement user deletion/export (GDPR)
- Test with multiple real users

---

### 3. **Quiz System Relies on Manual Mentor Assessment**
**Gap:** Quizzes are "taken conversationally with a mentor" — no in-app grading mechanism.

**Why it's a risk:**
- Impossible to scale (requires 1:1 mentor time)
- Subjective grading (what counts as "passing"?)
- No way for users to know if they can advance
- No record of quiz attempts in UI

**Fix needed for real learning platform:**
- Build AI-powered quiz evaluation (Claude evaluates answers)
- Or: multiple-choice + auto-grading
- Store quiz attempts & feedback in database
- Show pass/fail in UI before allowing Layer N+1 access

---

### 4. **Python Execution is Client-Side Only (Pyodide Limitations)**
**Gap:** All code runs via Pyodide (WASM Python). Cannot install packages, limited stdlib.

**Why it's a risk:**
- Users can't write realistic AI code (no numpy, pandas, pytorch, etc.)
- Limits practical learning (especially for Layer 2-6 where ML frameworks are essential)
- Large packages timeout or fail silently
- Misleading: looks like "real" Python practice, but isn't

**Fix needed for Layers 2-6:**
- Server-side Python execution (FastAPI, Docker)
- Or: Link to Jupyter notebooks (Google Colab, Replit)
- Make it explicit what can/can't be done client-side

---

### 5. **No Error Logging, Monitoring, or Analytics**
**Gap:** No way to know if users hit bugs, errors, or abandon the app.

**Why it's a risk:**
- Can't debug issues in production
- No visibility into actual usage (only hardcoded user)
- No way to measure if learning is working
- Can't detect infrastructure failures

**Fix for production:**
- Add error tracking (Sentry, LogRocket)
- Add analytics (Google Analytics, Mixpanel)
- Log API errors with timestamps
- Monitor Vercel deployment health

---

## Design Limitations

### 6. **Only One Roadmap Implemented**
**Gap:** Only "AI Engineering" roadmap exists. Code claims to support multiple, but none added.

**Why it's a risk:**
- Can't validate "generic structure" claim
- Value proposition requires multiple roadmaps, but doesn't deliver
- Limits user base to AI engineers

**What's needed:**
- Add roadmaps for other roles (Data Engineer, ML Ops, AI PM, etc.)
- Validate that the generic structure actually works
- Or: Remove claim about extensibility if it's not real

---

### 7. **No Onboarding or Guidance for New Users**
**Gap:** No tutorial, welcome flow, or documentation visible in-app.

**Why it's a risk:**
- Fork + run = confusion (where do I start? how do I use this?)
- UI has no obvious call-to-action
- Week 1 courses listed but no explanation of next steps

**What's needed:**
- Welcome modal on first visit
- Quick-start guide (3 steps to first course)
- Tooltips explaining layer concept
- "What to do next" suggestions

---

### 8. **No Data Export or Backup**
**Gap:** All progress stored in Turso. No way to download your data.

**Why it's a risk:**
- User locked into the platform
- If Turso goes down or account deleted, data gone
- GDPR compliance issue (users can't access/port their data)

**What's needed:**
- Export API endpoint (JSON dump of all user data)
- Manual backup instructions
- Data deletion endpoint

---

### 9. **Quiz Questions Are Hardcoded in JSON**
**Gap:** Quizzes defined once in `layers.json`. No way to update, retake, or track attempts.

**Why it's a risk:**
- Can't iterate on questions based on learner feedback
- No attempt history (can't see if you improved)
- Same questions forever (no freshness, rote memorization risk)

**What's needed:**
- Quiz engine that tracks attempts & scores
- Admin interface to update questions
- Option to retake quizzes

---

## Content Gaps

### 10. **Incomplete Roadmap (Only Layer 1 Has Full Content)**
**Gap:** Only Layer 1 (AI Foundation) has 4 courses + weekly plans. Layers 2-6 are sparse.

**Why it's a risk:**
- Can't validate full 9-month roadmap
- Layers 2-6 may be incomplete or missing
- Roadmap is aspirational, not production-ready

**What's needed:**
- Complete course lists for Layers 2-6
- Weekly plans for each week
- Quiz questions for each layer
- Verified course links (do they still exist?)

---

### 11. **Project Links Are Hardcoded (Cuva AI, NuraKnect AI)**
**Gap:** `/projects` page references author's own projects. Not applicable to other users.

**Why it's a risk:**
- Value prop is "connect to YOUR projects" but example is hardcoded
- Confusing for other users (who are these projects?)
- Projects may be private or not exist

**What's needed:**
- Let users add their own projects
- Or: Remove hardcoded project links
- Or: Explain what these projects are (docs/links)

---

## Technical Debt

### 12. **No Type Safety on API Responses**
**Gap:** API routes return JSON, but no strict TypeScript interfaces for all endpoints.

**Why it's a risk:**
- Frontend can break silently if API response changes
- No validation on API input (bad data accepted)
- Hard to add new fields without breaking clients

**What's needed:**
- Define Zod schemas for all API inputs/outputs
- Validate on API boundary
- Use `@/types` to match schema + client

---

### 13. **Hardcoded User ID in Tests**
**Gap:** Some code paths assume `userId === "chandu"` or similar.

**Why it's a risk:**
- Can't test with different users
- Hidden bugs in multi-user flow
- Test data not reproducible

**What's needed:**
- Remove hardcoded user IDs
- Use session user consistently
- Add test fixtures for multiple users

---

### 14. **No Automated Tests**
**Gap:** No unit, integration, or E2E tests in the codebase.

**Why it's a risk:**
- Can't safely refactor
- Bugs discovered only by manual testing
- CI/CD has no test gate

**What's needed:**
- Add Jest + React Testing Library (frontend)
- Add API route tests (backend)
- Add E2E tests (Playwright)
- Gate merges on test pass

---

### 15. **CSS Not Modular**
**Gap:** Styling is in `globals.css` with some inline styles.

**Why it's a risk:**
- Hard to maintain across components
- No design system or component library
- Mobile responsiveness may have gaps
- Animations hardcoded in Framer Motion props

**What's needed:**
- Move to CSS Modules or Tailwind
- Define design tokens (colors, spacing, typography)
- Build reusable component library
- Test mobile/tablet/desktop

---

## Credibility Concerns

### 16. **"Built 100% with AI" — No Manual Code**
**Gap:** All code written by Claude. Author wrote 0 lines.

**Why it matters for credibility:**
- ✅ **Strengths:**
  - Proves AI can generate full-stack apps
  - Demonstrates AI workflow capability
  - Real working product, not toy demo
  
- ❌ **Weaknesses:**
  - Raises question: "Can you actually code?"
  - No proof of debugging/problem-solving skills
  - Hard to explain code in interviews (didn't write it)
  - Interviewers may assume you can't code without AI
  - Can't customize code quickly (dependent on AI assistance)

**How to frame this:**
- Lead with **intent**: "I wanted to test how fast I could build a full-stack app using AI assistance, not traditional coding"
- Acknowledge: "I didn't write code, but I designed the system, defined the data model, chose the tech stack, and validated the product"
- Prove problem-solving: "When bugs appeared, I diagnosed the issue and prompted Claude to fix it"
- Show depth: Talk about architectural decisions (why Next.js, why Turso, why this UI design)

---

### 17. **Only 1 User, No Real Validation**
**Gap:** App only used by author. No external users, no feedback, no adoption.

**Why it matters:**
- ❌ Can't claim "useful for others" — no evidence
- ❌ Can't prove product-market fit
- ❌ May have hidden usability bugs (author = biased)
- ✅ But: Honest about current status (personal tool)

**How to frame:**
- Call it what it is: "Personal learning tracker I built to..."
- Be honest: "1 user right now; roadmap includes multi-user features"
- Offer path: "Open sourced publicly; anyone can fork and use"

---

### 18. **No Public Proof Points**
**Gap:** No blog posts, talks, tweets, or interviews about this project.

**Why it matters:**
- No SEO/discoverability
- Can't prove you can communicate your work
- Lack of external validation

**How to change this:**
- Write blog post: "How I built a full-stack app with 100% AI assistance"
- Tweet progress (weekly)
- Submit talk to conference ("AI-Assisted Web Development")
- Add badges/screenshots to GitHub README

---

### 19. **Architecture Designed for 1 User, Not Many**
**Gap:** Database schema + auth + UI all assume single user. Multi-user would require major rewrites.

**Why it matters:**
- Claim about "useful for others" conflicts with technical reality
- Not actually extensible yet — only pretend-extensible
- Would need to rebuild for real multi-user launch

**What's needed:**
- Acknowledge: "Currently single-user; multi-user requires X, Y, Z"
- Or: Actually build multi-user support first

---

## Missing Before "Production" Launch

| Feature | Why Needed | Priority |
|---------|-----------|----------|
| Real authentication (signup/login) | Can't have multiple users without it | 🔴 Critical |
| User management (settings, delete account) | GDPR compliance | 🔴 Critical |
| Error logging (Sentry) | Can't debug production bugs | 🔴 Critical |
| Automated tests | Can't safely deploy changes | 🟡 High |
| Quiz grading engine | Can't scale quiz system | 🟡 High |
| Data export endpoint | User rights + portability | 🟡 High |
| Onboarding flow | New users get stuck | 🟠 Medium |
| Analytics | Can't measure success | 🟠 Medium |
| Multiple roadmaps | Validates "extensible" claim | 🟠 Medium |
| Server-side Python execution | Realistic code practice for ML | 🟠 Medium |

---

## Summary: What to Emphasize vs. Downplay

### ✅ Emphasize:
- **Speed:** Built a full-stack app in weeks using AI
- **Architecture:** Clean Next.js, type-safe Drizzle, serverless scaling
- **Product thinking:** Layer-based learning, project-driven, structured progression
- **Honest scope:** "Personal tool, open-sourced; multi-user roadmap exists"

### ❌ Downplay/Acknowledge:
- **Single user:** "Currently me; working toward multi-user"
- **No manual coding:** "Intentional experiment in AI-assisted dev; prove intent in interviews"
- **Hardcoded auth:** "Works for now; would upgrade before scaling"
- **Incomplete layers:** "Layer 1 complete; Layers 2-6 in progress"

---

## Biggest Risks if Someone Reviews This

1. **Interviewer asks:** "Did you write the code?" → Be honest, explain the intent
2. **User tries to sign up:** → Explain it's hardcoded, direct to fork
3. **Someone runs the app locally:** → Missing .env, cryptic errors
4. **Code review:** → Will find type gaps, no tests, hardcoded IDs
5. **Production incident:** → No logging, can't debug

**Mitigation:** Update README with "Known Limitations" section + link to this doc.

