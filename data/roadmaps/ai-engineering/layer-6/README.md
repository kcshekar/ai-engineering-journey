# Layer 6 — Production AI Systems

Weeks 19–22. Make an AI feature fast, cheap and reliable: serving basics, caching, routing, retries, monitoring, and interview practice. Examples use NuraKnect.

Main source: [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) (MIT), Phase 17 and the interview bank.

## Items

| ID | Title | Kind | Hours | Track |
|---|---|---|---|---|
| c601 | Efficiently Serving LLMs | course | 2.5 | core |
| c602 | Prompt caching (Anthropic docs, then OpenAI) | docs | 1.5 | core |
| c603 | Timeouts, retries and backoff with jitter | article | 1.5 | core |
| c613 | Project: streaming, retries and a cost log for the NuraKnect reply endpoint | project | 4 | core |
| c604 | Prompt and semantic caching (AI Engineering from Scratch, Phase 17 lesson 14) | repo | 2.5 | core |
| c605 | Model routing and fallbacks (AI Engineering from Scratch, Phase 17 lesson 16) | repo | 2.5 | core |
| c614 | Project: prompt and semantic caching plus a cheap/expensive router, with measured cost and p95 latency | project | 5 | core |
| c606 | vLLM: quickstart and serving docs | docs | 3 | core (pick one) |
| c607 | Ollama: docs and API | docs | 3 | core (pick one) |
| c608 | llama.cpp: server and quantized models | repo | 3 | core (pick one) |
| c615 | Project: serve an open model behind the same API, load-test it, write a cost/latency scorecard | project | 6 | optional |
| c610 | Structured outputs (Anthropic docs, then OpenAI) | docs | 1.5 | optional |
| c611 | Langfuse: tracing and prompt versioning | docs | 2 | optional |
| c609 | AI engineering interview bank: system design, inference serving, cost and capacity | repo | 3 | core |
| c612 | Claude Code best practices (AI coding tools) | docs | 1.5 | optional |
| c616 | Multimodal and voice: vision inputs and realtime speech | docs | 2 | optional |

Core about 25.5 h (counting the pick group once), optional about 13 h.

## Projects

- Beginner (c613): streaming, retries with backoff and a cost log for the NuraKnect reply endpoint.
- Intermediate (c614): prompt and semantic caching plus a cheap/expensive router, measured with cost and p95 latency.
- Advanced (c615, optional): serve an open model with vLLM, Ollama or llama.cpp behind the same API, load-test it, write a one-page scorecard.

## Outcomes

- Explain the KV cache, batching and why output tokens cost more
- Cut cost and latency with prompt caching, semantic caching and model routing, and measure the result
- Make API calls reliable with streaming, timeouts, retries with jitter and rate-limit handling
- Run an open model locally with vLLM, Ollama or llama.cpp behind an OpenAI-compatible API
- Report p50 and p95 latency and cost per request for an AI feature
- Answer AI system-design questions on serving, cost and capacity

