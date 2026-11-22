# Layer 6 — Production AI Systems Notes
**Status:** Not Started
**Duration:** Weeks 19–22
**Items:** 15
**Quiz Score:** —
**Completed Date:** —

---

## Item c601 — Efficiently Serving LLMs

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### KV cache
- What is stored, and why does it grow with context length?
- How much GPU memory would your longest NuraKnect conversation use?

#### Batching
- What is continuous batching and why does it raise throughput?
- What happens to latency when the batch gets large?

#### Latency terms
- What is time to first token and what is tokens per second?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c602 — Prompt caching (Anthropic docs, then OpenAI)

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Cache design
- Why must stable content go first in the prompt?
- Which NuraKnect prompt parts are stable and which change each DM?

#### Pricing
- How are cache writes and cache reads billed (check the docs today)?
- How do you compute a cache hit rate from the usage fields?

#### Anthropic vs OpenAI
- What is explicit and what is automatic in each design?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c603 — Timeouts, retries and backoff with jitter

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Retries
- Which errors are safe to retry and which are not?
- What is an idempotency problem when retrying a DM reply?

#### Backoff and jitter
- Why does jitter matter when many clients fail together?

#### Rate limits and timeouts
- How do you read the retry-after information and set a timeout budget?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c613 — Project: streaming, retries and a cost log for the NuraKnect reply endpoint

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Streaming
- What changed in the user's felt latency?

#### Retries
- What is your retry budget and cap?

#### Cost log
- What fields does each log line contain?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c604 — Prompt and semantic caching (AI Engineering from Scratch, Phase 17 lesson 14)

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Exact vs prompt vs semantic caches
- When is each one the right tool?

#### Threshold
- How did you choose the similarity threshold and how do you detect a false hit?

#### Invalidation
- What TTL and what events clear entries for NuraKnect?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c605 — Model routing and fallbacks (AI Engineering from Scratch, Phase 17 lesson 16)

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Routing rules
- What signals decide cheap vs expensive?

#### Fallbacks
- What happens when the provider is down or over budget?

#### Measuring quality
- How do you know the cheap model is good enough?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c614 — Project: prompt and semantic caching plus a cheap/expensive router, with measured cost and p95 latency

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Baseline
- What were cost per 100 replies and p50/p95 before changes?

#### After caching and routing
- What changed, and which change helped most?

#### Surprises
- What false hit or bad route did you find?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c606 — vLLM: quickstart and serving docs

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Setup
- Which GPU or hosted GPU did you use?

#### Serving
- How do you start the OpenAI-compatible server and what flags matter for memory?

#### Behaviour
- What did you notice under concurrent load?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c607 — Ollama: docs and API

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Setup
- Which model and quantization did you run?

#### API
- How do you call it from the same client code?

#### Limits
- Where did it slow down or run out of memory?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c608 — llama.cpp: server and quantized models

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Setup
- Which GGUF model and quantization did you run?

#### Server
- How do you start the server and set context size and threads?

#### Quality
- What did quantization cost in quality?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c615 — Project: serve an open model behind the same API, load-test it, write a cost/latency scorecard

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Method
- How did you load-test (tool, concurrency levels)?

#### Results
- p50, p95, tokens per second and cost per 1k replies

#### Verdict
- Build or buy for NuraKnect today, and why?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c610 — Structured outputs (Anthropic docs, then OpenAI)

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Schemas
- How do you define the output shape and handle a refusal or invalid result?

#### Anthropic vs OpenAI
- What differs in how you ask for structured output?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c611 — Langfuse: tracing and prompt versioning

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Tracing
- What do you record for each call?

#### Prompt versions
- How do you roll back a prompt change?

#### Monitoring
- Which three alerts would you set for NuraKnect?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c609 — AI engineering interview bank: system design, inference serving, cost and capacity

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Questions I answered
- List the questions and your answers in one line each.

#### Gaps
- Which topics were weakest?

#### Trade-offs
- Which trade-off do you explain best now?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Item c612 — Claude Code best practices (AI coding tools)

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Workflow
- How do you give the tool context and verify its work?

#### Risks
- What do you never let it do unreviewed?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially

### Connection to NuraKnect
(What did you build or change because of this?)

---

## Layer 6 — Overall Insights

### The Three Most Important Things I Learned
1.
2.
3.

### My Cost and Latency Numbers
| Setup | Cost per 100 replies | p50 | p95 |
|---|---|---|---|
| Baseline | | | |
| Cached | | | |
| Routed | | | |
| Self-hosted | | | |

### Mistakes I Will Not Repeat

### Questions Still Unanswered

---

## Layer 6 Quiz Results
| Question | Topic | Score |
|---|---|---|
| Q1 | Cost and latency diagnosis | /10 |
| Q2 | KV cache and batching | /10 |
| Q3 | Semantic cache design | /10 |
| Q4 | Build vs buy | /10 |
| **Total** | | |

---

## c616 — Multimodal and Voice: Vision Inputs and Realtime Speech (optional)

### Summary
(How are images sent to a model, and how are they billed? How does a realtime voice session differ from a text request?)

### Key Concepts
- Image inputs: formats, size limits, and how images turn into tokens
- When a screenshot in a DM is worth a vision call, and when OCR or plain text is enough
- Realtime speech: streaming audio in and out, turn detection, and latency budgets
