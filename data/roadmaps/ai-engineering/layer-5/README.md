# Layer 5: Evaluation & Safety

Weeks 15-18. Learn to measure whether an LLM feature works, observe it in production, and defend it against prompt injection. Example product: NuraKnect, the Instagram DM assistant.

## What it covers
- Eval fundamentals: golden datasets, metrics, offline vs online eval, regression tests in CI
- LLM-as-judge and its biases, RAG evals with RAGAS, agent evals (task success, trajectory)
- Observability: pick one of Langfuse, LangSmith or Helicone
- Safety: prompt injection (OWASP Top 10 for LLM Applications), guardrails, red teaming
- Main source: AI Engineering from Scratch phases 11, 14 and 18

## Items
| ID | Title | Kind | Hours | Track |
|---|---|---|---|---|
| c501 | Your AI Product Needs Evals | article | 1.5 | core |
| c502 | AI Engineering from Scratch: Phase 11, Evaluation & Testing LLM Applications | repo | 2.5 | core |
| c503 | Project: 30-case golden set and pass/fail script for NuraKnect DM replies | project | 3 | core |
| c504 | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | article | 2.5 | core |
| c505 | RAGAS: metrics for RAG evaluation | docs | 3 | core |
| c506 | AI Engineering from Scratch: Phase 14, Eval-Driven Agent Development | repo | 2.5 | core |
| c507 | Evaluating AI Agents | course | 2.5 | optional |
| c508 | Langfuse: tracing and evaluation docs | docs | 3 | core (pick one) |
| c509 | LangSmith docs: tracing and evaluation | docs | 3 | core (pick one) |
| c510 | Helicone docs: LLM observability | docs | 3 | core (pick one) |
| c511 | Project: LLM-as-judge with a rubric, calibrated against your own labels | project | 4 | core |
| c512 | OWASP Top 10 for LLM Applications | docs | 2 | core |
| c513 | AI Engineering from Scratch: Phase 11, Guardrails, Safety & Content Filtering | repo | 2.5 | core |
| c514 | AI Engineering from Scratch: Phase 18, Red Teaming and Automated Attacks | repo | 2 | optional |
| c515 | Project: red-team the NuraKnect DM assistant, add a guardrail, and gate it in CI | project | 5 | core |

## Projects
- Beginner (c503): 30-case golden set and pass/fail script for NuraKnect DM replies
- Intermediate (c511): LLM-as-judge with a rubric, calibrated against your own labels; report agreement
- Advanced (c515): red-team the DM assistant for prompt injection, add a guardrail, show before/after numbers, wire evals into CI

## Outcomes
- Build a golden dataset and a pass/fail eval script for an LLM feature
- Design an LLM judge with a rubric and measure its agreement with human labels
- Evaluate a RAG pipeline with faithfulness and context metrics, and an agent with task success and trajectory checks
- Instrument an LLM app with tracing in Langfuse, LangSmith or Helicone
- Red-team an assistant for prompt injection and reduce attack success with guardrails
- Run evals in CI so a quality drop blocks a merge
