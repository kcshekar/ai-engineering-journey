# Layer 4 — Fine-tuning & Training

Weeks 11–14. When to fine-tune, building datasets, LoRA/QLoRA, quantization and preference tuning, then a tuned model you can compare and serve.

Start here: If you already fine-tuned a model with PEFT, skim c401 to c404 and start at c405; if you only prompt today, start at c401 and do the dataset project early.

## What it covers
- When to fine-tune vs prompt vs RAG, and how to build and format a dataset
- Instruction tuning (SFT), LoRA and QLoRA with Hugging Face PEFT, and a hands-on Unsloth notebook
- Quantization basics (GGUF, AWQ, bitsandbytes)
- Optional: DPO, GRPO and RLVR
- Training stack: pick one of TRL, Unsloth or Axolotl

## Items
| ID | Title | Kind | Hours | Track |
|---|---|---|---|---|
| c401 | Finetuning Large Language Models | course | 1.5 | core |
| c402 | OpenAI fine-tuning guide (when to fine-tune) | docs | 1.5 | core |
| c403 | AI Engineering from Scratch: Data Pipelines (Phase 10, lesson 03) | repo | 2 | core |
| c404 | AI Engineering from Scratch: Instruction Tuning / SFT (Phase 10, lesson 06) | repo | 2.5 | core |
| c405 | AI Engineering from Scratch: Fine-Tuning with LoRA and QLoRA (Phase 11, lesson 08) | repo | 3 | core |
| c406 | Hugging Face PEFT documentation | docs | 1.5 | core |
| c407 | TRL: SFTTrainer (Hugging Face) | docs | 3 | core (pick one) |
| c408 | Unsloth: fine-tuning guide and free Colab notebooks | docs | 3 | core (pick one) |
| c409 | Axolotl documentation | docs | 3 | core (pick one) |
| c410 | AI Engineering from Scratch: Quantization (Phase 10, lesson 11) | repo | 2 | core |
| c411 | AI Engineering from Scratch: DPO (Phase 10, lesson 08) and TRL DPOTrainer | repo | 2.5 | optional |
| c412 | Unsloth: reinforcement learning guide (GRPO and RLVR) | docs | 2.5 | optional |
| c413 | Project: build a 200-example NuraKnect instruction dataset | project | 5 | core |
| c414 | Project: LoRA fine-tune a small open model and compare to prompting | project | 7 | core |
| c415 | Project: quantize and serve the tuned model locally with an eval comparison | project | 6 | optional |

Main source: AI Engineering from Scratch (MIT), phases 10 and 11.

## Projects
- Beginner (c413): build and clean a 200-example instruction dataset from NuraKnect-style DMs, with a train/eval split.
- Intermediate (c414): LoRA fine-tune a small open model on it in free Colab and compare it with prompting.
- Advanced (c415, optional): quantize and serve the tuned model locally and run an eval comparison.

## Outcomes
- Decide between prompting, RAG and fine-tuning for a given NuraKnect task and explain the trade-off
- Build, clean, validate and split a chat-format instruction dataset
- Fine-tune a small open model with QLoRA in free Colab using one training stack
- Compare a tuned model with a prompted baseline on a held-out eval set
- Quantize a model to GGUF and serve it locally while measuring the quality cost
- Explain where DPO and GRPO fit after supervised fine-tuning
