# Research 02: Bosscoder "AI Forward Deployed Engineer" program + FDE role
Fetch date: 2026-11-23. Method: WebFetch (markdown-converted, summarised by a small model, so wording is paraphrased; structure is verified, exact wording is not) and WebSearch.

## 0. Sources
- Main page: https://www.bosscoderacademy.com/ai-forward-deployed-engineer (sitemap lists /ai-forward-deployed-engineer-program; same program)
- Sitemap: https://www.bosscoderacademy.com/sitemap
- Sibling pages: /genai-course (Applied GenAI & Agentic AI), /genai-ml-engineer-course (9-month GenAI & ML), /genai-agenticai, /transformer, /evolve, /devops-course, /data-engineer, /accelerator
- Blog (only seen in search results, NOT fetched): /blog/software-engineering-genai-curriculum, /blog/ai-courses-for-software-engineers, /blog/best-ai-course-india
- Palantir FDAIE posting: https://jobs.lever.co/palantir/ff1029bd-bb6d-4d78-a03e-5f9744d0b798
- Pragmatic Engineer: https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers (orig 2025-08-12, updated 2026)
- Paraform OpenAI FDE (third-party, 2026-06-12): https://www.paraform.com/blog/openai-forward-deployed-engineer
- Anthropic postings (aggregator snippets only, not opened): https://www.anthropic.com/careers/jobs/4985877008 , https://job-boards.greenhouse.io/anthropic/jobs/5012991008

## 1. Program overview (main page)
- Title: Forward Deployed AI Engineer Program. Tagline: AI engineering + client-facing consulting built around real client projects, "from discovery calls to production deployment".
- Stats: 2200+ engineers upskilled; 2200+ students placed (logo wall of 30 companies); 500+ hiring partners.
- Industry-signal section cites WSJ, Forbes, FT; claim "FDE postings up 800%+ in 2025" (FT). UNVERIFIED, not checked at source.
- FDE defined via three pillars: Build (software eng), Deploy (platform eng), Solve (solutions architecture).
- No fee shown (callback required). The sibling Applied GenAI page shows INR 1,10,000 with instalments (different program).
- Core duration: 24 weeks across 7 timed modules (my sum: 3+2+5+3+4+2+5), plus self-paced electives.

## 2. Curriculum: 8 modules in order
| # | Module | Weeks | Project |
|---|---|---|---|
| 1 | LLM Engineering & Model Integration | 3 | AI Interview Coach |
| 2 | Backend & API Engineering | 2 | Personal AI Morning Briefing |
| 3 | LLM Mastery & RAG Systems | 5 | none listed (aimed at senior engineers) |
| 4 | Advanced Retrieval & Model Specialization | 3 | Train Your Own Mini AI on Custom Data |
| 5 | Agentic & Multi-Agent Systems | 4 | Personal AI Assistant That Works On Its Own |
| 6 | Cloud & DevOps | 2 | Put Your AI on the Internet |
| 7 | FDE & Client Consulting | 5 | Run A Full Client Engagement End To End |
| 8 | Electives (self-paced, alongside) | - | none |

### M1 LLM Engineering & Model Integration (3 wk)
- Fundamentals: transformer, attention, KV cache, MoE; reasoning models (o1, Claude extended thinking); tool comparison (ChatGPT, Claude, Copilot, Cursor); no-code (Bolt, Lovable, V0, n8n).
- Prompt design: zero/few-shot, role/task/context/format/persona/tone, CoT, ToT, self-consistency, reflection/self-critique, Plan-and-Execute, chaining, system prompt architecture, multi-turn, prompt-injection defence.
- Advanced: function calling, structured outputs (Pydantic, instructor, json_schema), tokenization and cost (tiktoken, BPE, prompt compression), DSPy, ReAct, safety prompting, multimodal/doc understanding, code-review prompting, OpenAI/Anthropic/Gemini APIs, prompt versioning.
### M2 Backend & API Engineering (2 wk)
- Python (files, JSON, OOP, errors, asyncio, venv, dotenv, secrets hygiene, Git, structure); HTTP, status codes, pagination; OpenAI SDK (chat, streaming); Anthropic SDK (prompt caching); DSPy hands-on.
### M3 LLM Mastery & RAG (5 wk)
- LLMs: context engineering, JSON mode, hallucinations/failure modes, fine-tuning overview, cost/latency optimisation, build vs buy.
- RAG: parsing/ingestion, embeddings + vector DBs, chunking, semantic + hybrid search, metadata filters, enterprise RAG, reranking, grounding + citations, RAG evaluation.
### M4 Advanced Retrieval & Specialization (3 wk)
- Advanced RAG: query rewriting, multi-hop, cross-encoder rerank, CRAG, Self-RAG, Agentic RAG.
- Fine-tuning: LoRA, QLoRA (bitsandbytes), adapters, prefix tuning; HF transformers/PEFT/datasets; Axolotl; RunPod/vast.ai; distillation, RLHF, DPO (trl); Weights & Biases.
- Local deployment: Ollama, GGUF quantisation (Q4_K_M, Q8_0), Llama 3, Phi-3, Mistral, cost/perf trade-offs.
### M5 Agentic & Multi-Agent (4 wk)
- Architecture: ReAct, planner-executor, "Tool Arbiter" pattern, function calling, MCP, Tavily search, parallel tool calls.
- Frameworks: LangGraph (state machines, checkpointing, human-in-loop), CrewAI (sequential/hierarchical), agentic RAG, n8n.
- Memory (short/long/episodic), supervisor vs peer orchestration; evals: RAGAS, DeepEval, PromptFoo, trajectory eval; safety: Guardrails AI, injection defence, PII scrubbing, output filtering.
### M6 Cloud & DevOps (2 wk)
- Framing: work backwards from the customer problem, prototype to adoption and business impact.
- FastAPI (async, SSE, auth middleware, slowapi), Docker/compose (API, ChromaDB, Redis), GitHub Actions CI/CD with prompt regression, AWS (EC2, ECS Fargate, ECR, S3, RDS Postgres, Spot, autoscaling).
- Observability/safety: LangSmith tracing/dashboards, Guardrails AI, OpenAI moderation, DeepEval in CI, PromptFoo, LLMOps.
### M7 FDE & Client Consulting (5 wk), the differentiator
- Discovery/scoping: stated vs actual problem, LLM vs deterministic qualification, non-goals, acceptance criteria, PRD-lite, SOW, ADRs, baseline capture, success metrics.
- Enterprise data access: read replicas, CDC, schema archaeology, entity resolution, PII masking, REST/gRPC/OAuth connectors, pagination, rate limits, incremental sync.
- Deploying in client environments: VPC-only / private endpoint / air-gapped inference; SSO, SAML, OIDC, RBAC; multi-tenant isolation; hosted vs in-tenant vs self-hosted model placement; 10M+ doc vector search; token economics.
- Compliance and human loop: DPDP Act, GDPR, data residency; audit logs, model cards, retention; SOC 2 / ISO 27001 evidence; multi-tenant prompt injection; HITL approval gates; incident response.
- Stakeholder consulting and handover: architecture reviews with "hostile panels", defending trade-offs, deliberate failure-mode demos, handling unanswerable questions, runbooks, client enablement, pilot-to-rollout, impact reporting.
### M8 Electives (self-paced)
- System design (LB, caching, CDN, SQL/NoSQL, sharding, replication, CAP, queues, rate limit, circuit breakers, capacity estimation; URL shortener, news feed, chat, autocomplete).
- DSA (arrays to DP, complexity).

## 3. Sibling program: Applied GenAI & Agentic AI (/genai-course), 14 projects (each tagged 6 hours)
1. The Control Room: observability + eval stack (LangSmith, OpenTelemetry, Prometheus+Grafana, CI evals)
2. The Discovery Engagement: vague request to scoped/estimated project (interviewing, ADR, estimation)
3. The Data Excavation: reverse-engineer legacy system, CDC + entity resolution sync (Debezium, SQLAlchemy, RapidFuzz)
4. Prompt Evaluation Lab: CoT/self-consistency/ToT vs zero-shot, cost vs quality
5. Enterprise Support Assistant: multi-turn assistant, role-contract system prompt, red-teamed against 8 attack classes (Presidio)
6. The Model Bake-Off: provider-agnostic async client, streaming, caching
7. The Resilient Ingestor: 50,000 paginated records from a flaky API (httpx, tenacity)
8. The Policy Assistant: production RAG (LangChain LCEL, Chroma, Qdrant/Pinecone)
9. The Retrieval Bake-Off: BM25 + vector, cross-encoder rerank, RAGAS
10. The Multi-Hop Investigator: LangGraph multi-hop RAG with citations (Cohere Rerank)
11. The Specialist: LoRA/QLoRA small model beats big general model on a narrow task
12. The Operations Agent: MCP tool agent gated by an evaluating arbiter layer
13. The Claims Desk: stateful LangGraph agent, Postgres checkpointer, HITL approval
14. The Service: notebook to FastAPI + Docker + ECS Fargate + CI/CD
- Capstone and assessments: not specified. A Certifications section exists (GenAI and transformer certificates), no detail.
- Other programs (search snippets only, UNVERIFIED): GenAI & ML course is 9 months live/mentor-led; Software Engineering with Applied GenAI is 6 months with an 8-week GenAI module (LLM APIs, vector DBs, enterprise RAG, agentic workflows, MCP, LangChain, LangGraph); senior/Evolve programs add AI evaluation and safety.

## 4. Learning flow and pedagogy (what is visible)
- Sequence: prompts/APIs, Python/backend, RAG, advanced retrieval + fine-tune, agents, deploy, client consulting. Every module ends in a named, outcome-titled project ("Put Your AI on the Internet"). Consulting comes last as the capstone: "Run a full client engagement end to end".
- Cross-cutting concerns (evals, guardrails) recur in M3, M5, M6 instead of one late module.
- Live classes with assignments and guided projects; 1:1 mentorship (MAANG+ mentors, no names); doubt-solving; mock interviews; resume/LinkedIn; 500+ hiring partners. 7 named instructors (Amazon/Microsoft data scientists and ML engineers, 2 co-founders).
- Weekly cadence, class hours, batch size, assessment format, checkpoints: NOT PUBLISHED on fetched pages.
- Role mapping: Build/Deploy/Solve pillars; M7 mirrors a real engagement lifecycle (discover, scope, access data, deploy in client env, comply, hand over).

## 5. UI/UX of the pages
Main FDE page order: nav (Program, Curriculum, Projects, Mentors, Fees, Apply Now), hero (headline, 2200+ stat, CTAs Apply / Download Brochure), industry signal (press logos, 800% stat), what is an FDE (3 pillars), curriculum (8 modules with week count + project), projects + live classes (example client projects), mentorship/placement (resume before/after, 30-logo wall), instructors, testimonials (8), success-story blog cards, FAQ (24 Qs, 5 categories, accordion), closing CTA banner, footer.
Applied GenAI page order (17 sections): nav, hero with "Filling Fast!" badge + next-batch countdown + video, logo wall, market stats (38M jobs by 2030, 1.5M+ openings), why-this-exists 3 cards, career outcomes 3 cards, testimonial carousel with before/after company pairs, placement report download, projects grid with "6 HOURS" pills, instructors, features (curriculum/live/mentor/placement), comparison table vs others, certifications, final CTA, success stories, FAQ accordion, footer.
Visual cues: grid/circle decorative backgrounds, star glyph separators, rounded cards, circular logo tiles, uppercase pill tags, icon feature cards, plus/cross accordions, scrolling logo strips, carousels. Colours, fonts, spacing, mobile behaviour: NOT extractable via text fetch (UNVERIFIED; needs browser/screenshot).
Curriculum visualisation appears to be module cards with sub-topic groups; exact interaction unverified. No learner dashboard visible (login-gated).
CTAs: Apply Now, Apply For The Program, Download Brochure, Request A Callback (x2), Download Placement Report. Urgency: countdown, "Filling Fast".

## 6. FDE role 2025-2026
- Palantir (primary, Forward Deployed AI Engineer posting): work directly with customers on GenAI strategy + implementation; build end-to-end LLM workflows at scale to production; own high-stakes projects in small teams; feed learnings back into AIP. Requires LLM solution experience + GenAI landscape, ML basics (evaluation, training, problem decomposition), strong CS/engineering, Python/Java/C++/TS, up to 25% travel. Values production GenAI, data pipelines, real business problems over benchmarks, working with non-technical people, dynamic environments.
- Pragmatic Engineer (2025-08, updated 2026): mix of SWE, sales support, platform work; scoping, custom integrations, customer success; startup-CTO-like ownership. Expect fundamentals, customer empathy/communication, comfort with ambiguity, build-vs-buy judgement, drive. Palantir ~25% onsite; OpenAI FDE created 2024, phases scoping/validation/delivery.
- OpenAI (third-party summary, 2026-06, UNVERIFIED against the posting): Python + JS full-stack; RAG, eval frameworks, agent workflows in production; decomposition; communicating trade-offs; 4-stage loop (recruiter, coding, decomposition case, hiring manager); decomposition round eliminates most; feed gaps back to Product/Research.
- Anthropic (aggregator snippets, UNVERIFIED against anthropic.com): embed with large customers building production apps on Claude; ~4 yrs technical customer-facing or SWE+consulting; regulated verticals (finance, healthcare); understanding of LLM capability/limits; Python; ~25% travel.
- Caveat: much of the web is duplicated career-blog content; salary figures conflict.

## 7. FDE skills matrix for a personal roadmap
| Area | Skills |
|---|---|
| Core eng | Python + TS/JS, async, APIs/SDKs, SQL, Git, testing |
| LLM apps | prompting, structured output, function calling, caching, token economics, provider-agnostic clients |
| Retrieval | chunking, hybrid search, rerank, citations, RAG eval, multi-hop |
| Agents | ReAct, LangGraph state/checkpoint/HITL, MCP, memory, arbiter/guard layers |
| Model work | LoRA/QLoRA, DPO, local/quantised deploy, build-vs-buy |
| Eval/safety | RAGAS/DeepEval/PromptFoo, trajectory eval, red-teaming, PII, guardrails, injection |
| Production | FastAPI, Docker, CI with prompt regression, AWS/ECS, tracing/OTel, LLMOps |
| Data integration | CDC, entity resolution, schema archaeology, connectors (OAuth, gRPC), incremental sync, resilient ingestion |
| Enterprise deploy | VPC/air-gapped, SSO/SAML/OIDC, RBAC, multi-tenant, data residency, audit, SOC2/ISO/GDPR |
| Customer | discovery, scoping, SOW/PRD-lite/ADR, success metrics/baselines, stakeholder demos, hostile architecture review, runbooks, handover, impact reporting, decomposition-interview practice |
| Meta | ambiguity, ownership, feedback to product, onsite comfort |

## 8. Gaps vs the 6-layer roadmap (Foundation, Applied LLMs, Agents, Fine-tuning, Evaluation & Safety, Production)
Likely missing (not checked against the repo's JSON): customer discovery/scoping/SOW/ADR; enterprise data access (CDC, entity resolution, connectors); client-environment deployment (VPC, SSO, multi-tenant); compliance (GDPR/SOC2, audit, model cards); stakeholder communication + handover/runbooks; build-vs-buy and token economics; decomposition/case interview practice; OpenTelemetry/Grafana observability; system design + DSA electives; resilient async ingestion.

## 9. NOT accessible, and how to get it
| Item | Status | How |
|---|---|---|
| Brochure (PDF) | Download Brochure button, form-gated | fill form manually, save PDF, paste text |
| Syllabus page | linked in /genai-course nav, not fetched | open in browser, Print to PDF, paste text |
| FAQ answers (23 of 24) | collapsed accordion | expand in browser, copy text |
| Fees, EMI | callback only | request callback |
| Placement report | button; "No month data" | form download |
| Instructor/mentor cards (genai-course) | empty | n/a |
| Batch dates, weekly cadence, assessments, certification, mock interview format, capstone grading | not on pages | ask via callback / brochure |
| Colours, fonts, spacing, mobile, animations | text fetch cannot see | screenshot or devtools |
| Learner dashboard | login-gated | ask a student for screenshots |
| /genai-ml-engineer-course, blog curricula | not fetched this pass | fetch next or paste |
| Anthropic/OpenAI postings directly | only aggregators/third parties read | open careers pages manually |
