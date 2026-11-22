# Layer 1 — AI Foundation

**Weeks:** 1–3 · **Status:** Complete · **Courses:** 4/4 · **Quiz:** 66% + Remediation Pass

Neural networks, transformers, LLMs, and prompt engineering — the foundation everything
in Layer 2 onward builds on.

## Courses
1. [Neural Networks by 3Blue1Brown](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) — YouTube, 3.5 hrs
2. [How Transformer LLMs Work](https://www.deeplearning.ai/short-courses/how-transformer-llms-work/) — DeepLearning.AI, 90 min
3. [Neural Networks Zero to Hero (first 3 videos)](https://karpathy.ai/zero-to-hero.html) — Karpathy, 5 hrs
4. [ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) — DeepLearning.AI, 90 min

## In this folder
- `layer.json` — course metadata, `why`, and Python challenges (read by the app)
- `planning.json` — weekly focus, build tasks, and daily Python practice (read by the app)
- `notes.md` — deep-dive notes, key concepts, and code written while completing this layer

## All items (v2)
| id | Title | Kind | Hours | Track |
|---|---|---|---|---|
| c1 | Neural Networks by 3Blue1Brown | video | 3.5 | core |
| c2 | How Transformer LLMs Work | course | 1.5 | core |
| c3 | Neural Networks Zero to Hero (First 3 videos) | video | 5 | core |
| c4 | ChatGPT Prompt Engineering for Developers | course | 1.5 | core |
| c101 | Tokenizers: how text becomes tokens | repo | 1.5 | core |
| c102 | Sampling: temperature, top-k and top-p | repo | 1 | core |
| c103 | Embeddings (ML Crash Course) | course | 1.5 | core |
| c104 | Effective context engineering for AI agents | article | 1.5 | core |
| c105 | Context engineering lesson (hands-on) | repo | 2 | optional |
| c107 | Choosing a model (capability, cost, latency) | docs | 1 | core |
| c108 | OpenAI API docs: text generation (closed model) | docs | 2 | core (pick one: open-vs-closed) |
| c109 | Hugging Face LLM Course: Transformers models and open weights | course | 2 | core (pick one: open-vs-closed) |
| c111 | Project: Token and cost meter for NuraKnect DMs | project | 2 | core |
| c112 | Project: DM intent classifier with structured JSON | project | 3 | core |
| c113 | Project: Model bake-off, hosted vs local | project | 4 | optional |

## Projects
- c111 (beginner): Token and cost meter for NuraKnect DMs
- c112 (intermediate): DM intent classifier with structured JSON
- c113 (advanced): Model bake-off, hosted vs local

## Outcomes
- Explain tokens, context windows, sampling and embeddings without jargon
- Estimate the token cost of a NuraKnect prompt before sending it
- Pick a temperature for classification versus reply generation and justify it
- Assemble a request's context deliberately instead of pasting the whole chat
- Choose between a hosted and an open model using your own test set
