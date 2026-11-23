# Curriculum map: Applied / Agentic AI Engineer / FDE, late 2026

Date: 2026-11-23. 

## 0. Method and confidence (read first)
- Roadmap side is VERIFIED: item titles, stages and mustKnow terms were extracted from `data/roadmaps/ai-engineering/layer-1..6/layer.json`.
- Industry side: a verification pass on 2026-11-23 checked the items in section 0.1 against primary sources (URL + date given). Everything else still rests on my training knowledge (cutoff about June 2026) of: Anthropic/OpenAI/Google docs and changelogs, MCP spec, A2A, LangGraph, LlamaIndex, DSPy, vLLM, OWASP LLM Top 10 2025, Chip Huyen "AI Engineering" (2025), roadmap.sh AI Engineer / AI Agents, DeepLearning.AI course catalogue, and 2025-26 job-posting patterns. Everything tagged [U] is unverified and should be checked against the primary source before it becomes an item. Specific version numbers, spec revision dates and course names are deliberately avoided or tagged [U].
- Primary sources to verify against (one per topic): modelcontextprotocol.io (spec + changelog; auth, elicitation, structured tool output, streamable HTTP, registry [U]); a2aproject / a2a-protocol.org (Agent Card, tasks; moved under Linux Foundation in 2025 [U]); platform.claude.com docs (Agent SDK, skills, context editing/memory tool, prompt caching [U]); platform.openai.com docs (Responses API, Agents SDK, Realtime, Evals, Structured Outputs); ai.google.dev + google.github.io/adk-docs; langchain-ai.github.io/langgraph; docs.llamaindex.ai; huggingface.co/docs (TRL, PEFT, smolagents); dspy.ai; docs.vllm.ai; opentelemetry.io semantic conventions for GenAI (status: development [U]); genai.owasp.org (LLM Top 10 2025, Agentic AI threats).

### 0.1 Verified on 2026-11-23 (fetched live)
| Item | Finding | Source |
|---|---|---|
| MCP spec | Latest revision is **2026-07-28** (prior: 2025-11-25). Major changes: stateless protocol (no initialize handshake, no Mcp-Session-Id, `server/discover`), `subscriptions/listen`, tasks moved to official extension `io.modelcontextprotocol/tasks`, Multi Round-Trip Requests (`input_required`) replacing server-initiated elicitation/sampling/roots requests, required `resultType`, `ttlMs`/`cacheScope` caching on list results, OTel trace-context in `_meta`, Client ID Metadata Documents replacing Dynamic Client Registration (deprecated), `iss` validation (RFC 9207), JSON Schema 2020-12 in tool schemas. Deprecated: Roots, Sampling, Logging, HTTP+SSE transport. Feature lifecycle policy with 12-month deprecation window. Our "MCP sampling/roots/elicitation" teaching must change accordingly. | https://modelcontextprotocol.io/specification/latest/changelog (fetched 2026-11-23) |
| A2A | **v1.0** spec; Linux Foundation neutral governance, Apache 2.0; page says A2A joined the Agentic AI Foundation (AAIF); six SDKs (Python, Go, Java, JS, .NET, Rust); "works with MCP". GitHub latest release v1.0.1 (2026-05-26). | https://a2a-protocol.org/latest/ ; https://github.com/a2aproject/A2A/releases (2026-11-23) |
| OTel GenAI | Conventions **moved to their own repo** `open-telemetry/semantic-conventions-genai`; cover spans, metrics, events for GenAI clients, an agent-spans page, an MCP page, and provider pages (Anthropic, AWS Bedrock, Azure AI Inference, OpenAI). Repo shows no tagged release; stability status not stated on fetched pages, so treat as **not confirmed stable** [U]. | https://opentelemetry.io/docs/specs/semconv/gen-ai/ ; https://github.com/open-telemetry/semantic-conventions-genai (2026-11-23) |
| OWASP LLM Top 10 2025 | IDs LLM01-LLM10 confirmed exactly as listed in 1.5. A separate **OWASP Top 10 for Agentic Applications for 2026** exists, published 2025-12-09 (item titles not retrieved [U]). | https://genai.owasp.org/llm-top-10/ ; https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ |
| Package versions (PyPI, 2026-11-23) | openai-agents **0.25.0**; claude-agent-sdk **0.2.187**; google-adk **2.15.0** (major version 2 exists); langgraph **1.2.24**. Upload dates not captured. | https://pypi.org/pypi/{openai-agents,claude-agent-sdk,google-adk,langgraph}/json |
| FDE postings | Search found 2026 postings (Workable Oct 2026: 5+ yrs, customer ownership; talentpluto Jun 2026: 3+ yrs; Dynamo AI Sep 2026: guardrails, eval systems, observability, deployment architecture; Wellfound/Nexla: agentic workflows in client environments, LangChain/RAG/LangGraph; ~25% travel; pay ranges $130K-$230K). Several were aggregator pages; the Dynamo and Wellfound pages returned 410 on fetch, so only search-snippet detail. Paraform guide (2026-05-14) lists skills: production Python/TS, agents, eval frameworks, RAG, hallucination guardrails, observability, systems integration, stakeholder comms; names Anthropic, OpenAI, Scale, Palantir, Salesforce, Glean, Sierra, Decagon, Cursor as employers. Direct OpenAI/Anthropic/Palantir postings NOT retrieved [U]. | https://www.paraform.com/blog/forward-deployed-ai-engineer (2026-05-14); web search 2026-11-23 |
| roadmap.sh | Tagline "design, build and ship AI agents in 2026"; node lists render client-side and were NOT retrievable. Unverified [U]. | https://roadmap.sh/ai-agents , /ai-engineer |

## 1. Topic taxonomy (B = beginner, I = intermediate, A = advanced)

### 1.1 Core LLM application skills
| Topic | B | I | A |
|---|---|---|---|
| Context engineering | Context window, token budgeting, system vs user prompts | Context assembly: what goes in, ordering, compaction/summarisation, tool-result trimming, just-in-time retrieval, sub-agent context isolation | Context editing/clearing, memory tools, long-horizon agent compaction, context rot measurement, prompt-cache-aware layout |
| Structured outputs | JSON mode, Pydantic/Zod schema | Schema-constrained decoding (provider strict mode), retries/repair, enums, validation errors fed back | Grammar-constrained decoding (outlines/xgrammar/vLLM guided), schema evolution, extraction pipelines at scale, DSPy-style signatures |
| Tool use / function calling | Define a tool, run loop, return results | Parallel tool calls, error results, tool-description design, tool-choice control, step limits, idempotency | Tool search / dynamic tool loading for 100s of tools, programmatic tool calling, tool-eval, sandboxed code execution as a tool [U] |
| MCP servers and clients | Host/client/server roles, run an existing server | Build a server (tools, resources, prompts), stdio vs streamable HTTP, inspector, schemas | OAuth 2.1 authorisation, remote deployment, MCP security (tool poisoning, confused deputy), gateways |
| A2A | What it is vs MCP (agent-to-agent vs agent-to-tool) | A2A v1.0 (Linux Foundation / AAIF): Agent Card, task lifecycle, call a remote agent | Interop across frameworks (6 SDKs), auth, long-running tasks, when NOT to use it |
| Prompting | Roles, few-shot, CoT | Prompt versioning, templates, prompt as code | Automatic prompt optimisation (DSPy GEPA/MIPRO [U]), prompt regression suites |

### 1.2 Agents
| Topic | B | I | A |
|---|---|---|---|
| Agent patterns | ReAct loop; workflows vs agents (Anthropic "Building effective agents": chaining, routing, parallelisation, orchestrator-workers, evaluator-optimiser) | Plan-and-execute, reflection, supervisor/handoffs, human-in-the-loop, durable state | Long-running/background agents, checkpoint/resume, durable execution (Temporal/LangGraph persistence), multi-agent trade-offs, agent budgets |
| Frameworks | One framework end to end (pick one) | LangGraph (graphs, state, persistence, interrupts), OpenAI Agents SDK (handoffs, guardrails, tracing), Claude Agent SDK (subagents, hooks, skills, permissions) | Google ADK, CrewAI, smolagents, PydanticAI, Mastra/Vercel AI SDK; choosing no framework; migration and portability |
| Memory | Conversation window | Short vs long-term, summaries, vector memory, user profile memory | Memory tool / file-based memory, memory consolidation, temporal knowledge graphs (Zep/Graphiti/Mem0 [U]), forgetting and privacy |
| Computer-use / browser | Concept, screenshot loop | Playwright/Browser-use style agents, Anthropic computer use tool, OpenAI operator-style agents | Sandboxing, prompt-injection from web pages, reliability eval (OSWorld/WebArena-style benchmarks [U]), cost |
| Coding agents | Use Claude Code/Codex/Cursor well; AGENTS.md/CLAUDE.md | Skills, hooks, subagents, MCP in the IDE, test-driven agent loops | Build your own coding agent (SWE-bench-style harness), sandboxed execution, worktrees/parallel agents, review workflows |
| Skills / reusable agent capabilities | What an Agent Skill is | Author a skill (SKILL.md + scripts) | Skill governance and eval [U] |

### 1.3 Retrieval and knowledge
| Topic | B | I | A |
|---|---|---|---|
| RAG basics | Chunk, embed, retrieve, cite | Hybrid (BM25+vector, RRF), reranking, metadata filters, query rewriting, HyDE, contextual retrieval | Evaluation of retrieval vs generation separately, late-interaction (ColBERT), embedding fine-tuning, multi-vector, scaling/index choice |
| GraphRAG | Why graphs | Build a KG-backed retriever (Microsoft GraphRAG, Neo4j, LightRAG [U]) | Cost/benefit vs plain hybrid; when it loses |
| Agentic RAG | Retrieval as a tool | Multi-step retrieval, query decomposition, self-correcting (CRAG/Self-RAG) | Search agents over heterogeneous sources, deep-research agents, long-context vs RAG trade-offs |
| Data ingestion | PDF to text | OCR/layout parsing, tables, incremental indexing | Document intelligence pipelines, access control (ACL-aware retrieval) |

### 1.4 Modalities and interfaces
| Topic | B | I | A |
|---|---|---|---|
| Multimodal | Image input, vision Q&A | Document/chart extraction, video/audio input, image generation APIs | Multimodal RAG, eval of vision outputs |
| Voice / realtime | STT to LLM to TTS pipeline | Realtime APIs (OpenAI Realtime, Gemini Live), VAD, barge-in, WebRTC/WebSocket | Latency budgets (<800 ms), telephony (SIP), turn-taking, voice eval, LiveKit/Pipecat-style stacks [U] |
| AI product / UX | Streaming, loading states | Citations, confidence, undo, approval UI, feedback capture, generative UI | Trust/calibration design, agent UX (plans, progress, interrupts), product metrics, pricing |

### 1.5 Quality, safety, operations
| Topic | B | I | A |
|---|---|---|---|
| Evals | Golden set, pass/fail script | LLM-as-judge with rubric and human agreement, pairwise, RAG metrics, regression gates in CI | Trace/trajectory-based evals, agent evals (tool-call accuracy, task success), online evals on production traces, synthetic data, eval of judges, error analysis workflow (Hamel Husain/Shreya Shankar style) |
| Observability | Logging prompts/responses/cost | Tracing with Langfuse/LangSmith/Phoenix, spans, sessions, prompt versioning | OpenTelemetry GenAI semantic conventions (own repo semantic-conventions-genai; agent-span and MCP pages; stability not confirmed [U]); MCP now propagates traceparent in `_meta`, sampling, PII scrubbing, feedback-to-dataset loops |
| Guardrails / security | Prompt injection concept | OWASP LLM Top 10 2025 (LLM01 prompt injection, LLM02 sensitive info disclosure, LLM03 supply chain, LLM04 data/model poisoning, LLM05 improper output handling, LLM06 excessive agency, LLM07 system prompt leakage, LLM08 vector/embedding weaknesses, LLM09 misinformation, LLM10 unbounded consumption) | OWASP Top 10 for Agentic Applications 2026 (published 2025-12-09), agent security: lethal trifecta (private data + untrusted content + exfil), least privilege, sandboxing, MCP/tool poisoning, red-teaming (garak/PyRIT/promptfoo), policy/permission systems, compliance (EU AI Act GPAI obligations [U dates]) |
| Cost / latency | Count tokens, price a call | Prompt caching, batch APIs, streaming, timeouts/retries | Semantic caching, routing/cascades, speculative decoding, distillation, capacity planning |
| Routing | Pick a model per task | Rules/budget router, fallbacks | Learned routers, provider gateways (LiteLLM/OpenRouter-style) |
| Small / local models | Run Ollama | Quantised GGUF/AWQ, llama.cpp, on-device | Domain SLMs, edge deployment, privacy-first designs |
| Fine-tuning | SFT data, prompt vs RAG vs FT | LoRA/QLoRA with PEFT/TRL/Unsloth | DPO, preference data, GRPO/RLVR for verifiable tasks, RFT via provider APIs, distillation, eval-driven tuning |
| Inference serving | Hosted API vs self-host | vLLM basics, KV cache, continuous batching | PagedAttention, prefix caching, speculative decoding, tensor/pipeline parallel, SGLang/TensorRT-LLM, llm-d/disaggregated prefill-decode [U], GPU cost modelling |
| Deployment | Env/secrets, CI | Containers, serverless, queues for long jobs, rate limits | Multi-tenant isolation, SLOs, canaries, eval-gated release, data residency, on-prem/VPC delivery |

### 1.6 Forward Deployed Engineer (FDE) skills
| Topic | B | I | A |
|---|---|---|---|
| Discovery | Ask who/what/why; write a problem statement | Workflow mapping, success metrics, baseline measurement | Scoping ROI, build-vs-buy, risk register |
| Customer delivery | Demo clearly | Rapid prototype in days, stakeholder updates, handle ambiguity | Embedded delivery, security reviews, SOC2/HIPAA-aware design, change management |
| Integration | REST/webhooks, auth | ETL, SQL, enterprise systems (Salesforce, ServiceNow, SharePoint), SSO | Legacy/on-prem integration, data governance |
| Communication | Plain-language writing | Executive readouts, expectation setting on non-determinism | Handoff/enablement, feeding learnings back to product |

Source note: FDE postings (Palantir origin; Anthropic, OpenAI, Scale, many startups, 2025-26 [U]) consistently stress: Python + TypeScript, shipping prototypes to production at a customer, LLM/agent/RAG/eval experience, SQL/data integration, comms and travel. Postings sampled: see 0.1; direct frontier-lab postings still to be read.

## 2. Gap table vs our 6 layers
Legend: yes / partial / no. "Layer" = where it lives now.

| Topic | Present? (layer) | Evidence | Recommended action |
|---|---|---|---|
| Context engineering | yes (L1, intermediate) | 2 items: Anthropic "Effective context engineering", hands-on lesson | Add mustKnow "Context rot / compaction / just-in-time retrieval"; add agent-context project in L3; link caching layout to L6 |
| Structured outputs | partial (L1 project, L6 item) | DM classifier w/ JSON, L6 structured outputs doc | Move doc item to L1/L2 beside the project; add mustKnow "Schema-constrained decoding vs prompt-and-pray"; add repair/retry exercise |
| Tool use / function calling | yes (L3 beginner) | Function Calling deep dive | Add mustKnow items: parallel calls, tool-description design, tool search at scale |
| MCP servers/clients | yes (L3) | Intro, building server, project | Update to MCP 2026-07-28: stateless transport, discover, MRTR instead of server-initiated sampling/elicitation, tasks extension, deprecated Roots/Sampling/Logging; add auth (Client ID Metadata Documents), remote Streamable HTTP, MCP security; check our L3 MCP course items for staleness (they likely teach the 2025 handshake) |
| A2A | no | Not in any title or mustKnow | Add one intermediate item in L3 (A2A v1.0 + one SDK demo), mustKnow "A2A vs MCP" |
| Agent frameworks | yes (L3: Claude SDK, OpenAI SDK, LangGraph, CrewAI) | 4 items | Add Google ADK (v2.x now; verify migration from 1.x) (or pick-group to keep scope sane); add "pick one framework" pickGroup; add LangGraph persistence/interrupts task; add "no framework" baseline |
| Durable / long-running agents | no | none | Add advanced item (LangGraph checkpoints, Temporal-style, background agents) |
| Memory | partial (L3) | Context-window memory only | Add long-term memory item (memory tool / Mem0 / Zep [U]) and mustKnow "Short vs long-term memory" |
| RAG: hybrid, reranking, contextual, HyDE | yes (L2) | Strong | Keep. Add query rewriting/decomposition mustKnow |
| GraphRAG | yes (L2 advanced) | Microsoft GraphRAG | Add "when GraphRAG loses" note; optional project |
| Agentic RAG | yes (L2 advanced) | LlamaIndex course | Cross-link to L3; add deep-research-agent capstone |
| Document parsing/ingestion | no | none | Add item: layout/OCR/table parsing (Docling, Unstructured, LlamaParse [U]); ACL-aware retrieval mustKnow |
| Multimodal | partial (L6 advanced, one item) | Vision + realtime speech combined | Split: multimodal docs/vision to L2 (intermediate), voice to its own L3/L6 track item |
| Voice / realtime agents | partial (L6, bundled) | same item | Add voice-agent project (STT-LLM-TTS then Realtime API), latency budget mustKnow |
| Computer-use / browser agents | yes (L3 advanced, one item) | One item | Add safety angle (injection from pages); optional project |
| Coding agents | partial (L6 "Claude Code best practices") | One beginner item | Move earlier (L1/L2 as tooling); add skills/hooks/subagents/AGENTS.md item; advanced: build a mini coding agent |
| Evals: golden set, LLM judge, RAG | yes (L5) | Strong | Keep |
| Trace/trajectory evals, agent evals | yes (L5 intermediate) | Evaluating AI Agents, Phase 14 | Add online eval on production traces and error-analysis workflow mustKnow |
| Regression suites in CI | yes (L5) | Regression gate, red-team in CI | Keep |
| Observability tools | yes (L5 Langfuse/LangSmith/Helicone; L6 Langfuse) | Tool docs | Add OpenTelemetry GenAI item (no OTel anywhere; MCP spec itself now documents OTel context propagation and recommends OTel over MCP Logging); reorder tracing earlier (L3) since agents need it to debug |
| Prompt injection/OWASP | yes (L5 advanced) | OWASP Top 10, guardrails, red team | Update mustKnow to list 2025 IDs (verified) and add the OWASP Agentic Top 10 2026; add agent security (lethal trifecta, excessive agency, MCP poisoning); move a basic injection primer earlier (L3) |
| Cost/latency, caching, routing | yes (L6) | Strong | Keep; add batch API and gateway (LiteLLM-style) mustKnow |
| Small/local models | yes (L6 advanced, L1 bake-off) | Ollama, llama.cpp | Keep |
| Fine-tuning LoRA/QLoRA, DPO/GRPO | yes (L4) | Strong | Optional: de-prioritise for Applied/FDE tracks; add provider RFT/SFT via API item |
| Prompt optimisation / DSPy | no | none | Add intermediate item (DSPy) in L2 or L5 |
| Inference serving | yes (L6 advanced) | vLLM, llama.cpp | Add prefix caching/speculative decoding/PagedAttention mustKnow; SGLang mention |
| Deployment (containers, queues, multi-tenant, release gates) | partial (L6 hardening) | Only reliability basics | Add deployment item: Docker + hosted deploy of the agent, queue for long jobs, eval-gated release |
| AI product / UX | no | none (the app is itself a UX project, but no learning items) | Add L2/L6 item: AI UX patterns (streaming, citations, approvals, feedback) and agent UX |
| FDE customer-facing skills | no | none | New track/layer 7 (see section 4) |
| Data/SQL/integration | no | none | Add to FDE layer |
| Compliance/governance (EU AI Act, PII) | no | none | Add intermediate reading item in L5/L6 [U dates] |
| Python/TypeScript engineering baseline (async, typing, testing, APIs) | no | assumed | Add L0 prerequisite or "start here" checklist |

## 3. Projects and capstones that produce portfolio proof

### Beginner
1. Token/cost meter + structured-output classifier (exists in L1). Add: schema validation + retry report.
2. PDF Q&A with citations (exists). Add a deployed demo URL.
3. Single-tool agent with step limit and trace in Langfuse (new). Proof: public trace screenshots + README.
4. Voice note summariser (STT to LLM, new, small).

### Intermediate
5. Hybrid RAG with reranker and measured before/after (exists). Add 50-question eval set and a dashboard.
6. MCP server with auth, deployed remotely, used from Claude Desktop/Code and one other client (extends existing).
7. LangGraph or Agents-SDK workflow with interrupt/approval, persistence and resume (extends existing multi-agent).
8. Eval-gated CI: golden set + judge calibrated to human labels, failing PRs on regression (exists, make it public repo).
9. OpenTelemetry-instrumented agent exporting to two backends (new; proves vendor neutrality).
10. Document-intelligence pipeline for messy PDFs/tables (new).

### Advanced
11. Agentic RAG / deep-research agent with citations, budget limits and trajectory evals (new capstone).
12. Realtime voice agent with measured latency budget and barge-in (new).
13. Secure agent: red-team report against OWASP LLM01/06/07, fixes, regression tests (extends existing).
14. Fine-tune + serve with vLLM, cost/latency scorecard vs hosted API (exists). Optional GRPO on a verifiable task.
15. Mini coding agent with sandbox and SWE-bench-lite subset result (new, optional).
16. FDE capstone: pick a real small business/process, do discovery doc, prototype in one week, ROI readout, handoff docs (new). Proof: written case study + demo video.

## 4. Suggested structure: tracks and prerequisites

### Keep 6 layers, add targeted changes (recommended; smaller change than a rebuild)
- L1 Foundation: add coding-agent tooling item and Python/TS baseline checklist.
- L2 Applied LLMs: add multimodal/document parsing, DSPy, structured outputs (moved), AI UX.
- L3 Agents: add A2A, durable agents, long-term memory, Google ADK, basic injection primer, early tracing.
- L4 Fine-tuning: mark as optional per track.
- L5 Eval & Safety: add OTel, agent security, online evals, compliance.
- L6 Production: add voice/realtime (split out), deployment, release gates.
- New L7 Forward Deployed Engineering: discovery, integration, customer comms, capstone 16.

### Tracks (views over the same layers, set via `appliesTo` or pick groups)
| Track | Required | Optional |
|---|---|---|
| Applied AI Engineer | L1, L2, L5, L6 (+L3 basics) | L4 |
| Agentic AI Engineer | L1, L2 (RAG core), L3 full, L5 (agent evals, security), L6 | L4 |
| Forward Deployed Engineer | L1, L2, L3 basics, L5 basics, L6 deploy, L7 | L4 |
| Model/Inference specialist (optional) | L1, L4, L6 serving | L3 |

### Prerequisite graph
L1 (tokens, context, sampling, structured outputs) -> L2 (RAG) and L3 (tool use) in parallel -> L5 (evals) must start by mid-L3 (agents are undebuggable without traces and evals) -> L6 (production) -> L7 (FDE). L4 depends on L1 + L5 (eval before tuning). Reorder suggestion: pull tracing and a golden-set primer forward into L2/L3 instead of waiting for L5 (week 15).

## 5. Top gaps (ranked, after verification)
Changes: new gap 'MCP content is stale vs 2026-07-28 revision' entered at rank 3; A2A moved up to rank 5 (v1.0, LF-governed, 6 SDKs); agent security rank 4 (OWASP Agentic Top 10 exists); OTel rank 2 kept (MCP + agent conventions exist).

1. FDE/customer-facing track (none).
2. OpenTelemetry GenAI and early tracing.
3. MCP content stale vs spec 2026-07-28 (stateless, MRTR, tasks extension, deprecated Roots/Sampling/Logging, new auth). NEW.
4. Agent security (OWASP Agentic Top 10 2026, excessive agency, MCP poisoning, lethal trifecta).
5. A2A v1.0.
6. Long-term memory and durable/long-running agents.
7. Voice/realtime as a standalone item and project.
8. Deployment and eval-gated release.
9. Document parsing/ingestion and ACL-aware retrieval; AI product/UX.
10. DSPy, Google ADK 2.x, coding-agent skills/hooks.
