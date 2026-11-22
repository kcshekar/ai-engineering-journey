# Layer 1 — AI Foundation Notes
**Status:** Complete  
**Duration:** Weeks 1–3  
**Courses Completed:** 4/4  
**Quiz Score:** 66% + Remediation Pass  
**Completed Date:** 2025-07-22

---

## Course 1 — Neural Networks by 3Blue1Brown

### Summary
Neural networks are the foundational building blocks of machine learning.
They process input data through multiple connected layers of neurons,
each performing weighted calculations to progressively extract meaning.

### Key Concepts

- **Neurons** — each pixel in a 28x28 image = 784 neurons. Each neuron
  holds a value between 0 and 1 representing activation strength.
- **Weighted Sum** — every neuron calculates: `w1*a1 + w2*a2 + ... + b`
  where w = weight, a = activation from previous layer, b = bias.
- **Bias** — shifts the activation threshold. Controls when a neuron
  fires, independent of input strength.
- **Sigmoid** — original activation function. Squashes values to 0–1.
  Replaced due to vanishing gradient problem.
- **ReLU** — current standard activation. If input < 0, output = 0.
  Otherwise pass through unchanged. Keeps gradients healthy.
- **Loss Function** — measures how wrong the network's prediction is.
  The number backpropagation tries to minimise.
- **Gradient Descent** — the mechanism that adjusts weights. Calculates
  which direction to nudge each weight to reduce loss. Takes small steps
  repeatedly until loss is minimised.

### Backpropagation — Correct Understanding
Backpropagation happens ONLY during training. Never during inference.

**Analogy:** A kitchen team practising a recipe. When the dish tastes
wrong, you trace blame backward through the assembly line and tweak each
step slightly. After thousands of practice runs the team is excellent.
When serving real customers (inference), no feedback loop exists —
the team uses what they already learned. Weights are frozen.

### What I Got Wrong Initially
- Confused backpropagation with inference. Fixed.
- Thought encoder converts text to vectors and decoder converts back.
  Fixed — encoder creates rich contextual representations, decoder
  predicts next token probability distribution.

### Python Exercise
```python
def relu(values):
    return [max(0, v) for v in values]

print(relu([-2, -0.5, 0, 1.5, 3]))
# Output: [0, 0, 0, 1.5, 3]
```

---

## Course 2 — How Transformer LLMs Work (DeepLearning.AI)

### Summary
Transformers are the architecture powering all modern LLMs. They convert
sequences of tokens into progressively richer contextual representations,
layer by layer, until the model can confidently predict the next token.

### Key Concepts

- **Tokenisation** — text splits into subword tokens, not whole words.
  "hello" can become "hel" + "lo". GPT-4 vocabulary = 100,263 tokens.
- **Embeddings** — each token maps to a dense vector of numbers.
  Similar meanings cluster together in vector space.
- **Positional Encoding** — added to embeddings so the model knows
  word order. Without it, word position would be invisible.
- **Attention Mechanism** — every token looks at every other token
  and calculates relevance scores. Uses Query, Key, Value matrices.
  Softmax normalises scores to sum to 1.0.
- **Multi-Head Attention** — runs attention multiple times in parallel
  with different learned matrices. Each head captures different
  relationships — syntax, semantics, coreference.
- **Feedforward Layer** — Linear → ReLU → Linear. Expands to higher
  dimension (finds complex patterns), then down-projects back.
  Stores factual knowledge.
- **Transformer Block** — one Attention layer + one Feedforward layer.
  Repeated N times. GPT-2 = 12 blocks, GPT-3 = 96 blocks.

### Encoder vs Decoder
| Type | Direction | Used For | Examples |
|------|-----------|----------|---------|
| Encoder only | Bidirectional | Understanding, search | BERT |
| Decoder only | Left to right | Text generation | GPT-4, Claude, Llama |
| Encoder-Decoder | Both | Translation, summarisation | T5 |

**Important:** GPT-4, Claude, and AutoGen's underlying models are
decoder-only. No encoder present.

### Mixture of Experts (MoE)
- Instead of one feedforward network, many specialised experts exist.
- A router selects top 1–2 experts per token.
- Other experts stay idle — massive capacity, manageable compute.
- GPT-4 and Mixtral use this architecture.

### How Generation Actually Stops
1. Model predicts next token probability distribution
2. Highest probability token selected
3. Appended to sequence
4. Full forward pass runs again
5. Continues until `<EOS>` token wins OR `max_tokens` limit hit
6. Never infinite — always bounded by one of the two above

### Key Numbers
| Model | Blocks | Parameters | Vocabulary |
|-------|--------|------------|------------|
| GPT-2 | 12 | 117M | 50,257 |
| GPT-3 | 96 | 175B | 50,257 |
| GPT-4 | 120+ | ~1.8T (MoE) | 100,263 |
| Llama 3 70B | 80 | 70B | 128,256 |

### Python Exercise — Numerically Stable Softmax
```python
import math
def softmax(scores):
    max_score = max(scores)
    exp_scores = [math.exp(x - max_score) for x in scores]
    total = sum(exp_scores)
    return [x / total for x in exp_scores]

result = softmax([1000.0, 1001.0, 1002.0])
print([f'{p:.3f}' for p in result])
# Output: ['0.090', '0.245', '0.665']
```
Subtracting max_score before exp() prevents overflow. Production pattern.

---

## Course 3 — Neural Networks Zero to Hero (Karpathy, first 3 videos)

### Summary
Building neural networks from scratch in pure Python. Every abstraction
PyTorch provides becomes concrete when you implement it yourself.

### Key Concepts

- **micrograd** — tiny autograd engine built from scratch. Shows how
  automatic differentiation works at the value level.
- **Autograd** — automatic gradient computation. PyTorch does this
  for you. Understanding it manually makes debugging far easier.
- **Language model from scratch** — bigram character model to predict
  next character. Same principle as GPT at massive scale.
- **Training loop** — forward pass → compute loss → backward pass
  (backpropagation) → update weights → repeat.

### Core Insight
Every framework (PyTorch, TensorFlow, AutoGen's LLM calls) is an
abstraction over these fundamentals. When something breaks in production,
understanding the fundamentals tells you where to look.

---

## Course 4 — ChatGPT Prompt Engineering for Developers (DeepLearning.AI)

### Summary
Prompts are the primary interface between engineers and LLMs. Small
changes in prompt structure produce dramatically different outputs.
Mastering prompts is the highest-leverage skill for Applied AI Engineers.

### Key Concepts

- **Clear instructions** — be specific, not vague. Tell the model
  exactly what format, length, and tone you expect.
- **Delimiters** — use `"""`, `<tags>`, or backticks to clearly
  separate sections of your prompt. Prevents prompt injection.
- **Few-shot examples** — show the model 2–3 examples of ideal
  input/output pairs. Dramatically improves consistency.
- **Chain of Thought** — add "Think step by step" to force reasoning
  before answering. Reduces errors on complex tasks.
- **Temperature** — controls randomness. 0.0 = deterministic,
  consistent. 1.0+ = creative, varied. Use 0.0 for classification.
- **Output format control** — explicitly define exact JSON schema
  expected. Never just say "return JSON."
- **Iteration** — no prompt is right first time. Test with 20+
  inputs, measure, refine. Treat prompts like code.

### NuraKnect Production Prompt

---

# New items (roadmap v2)

## Item 101 — Tokenizers: how text becomes tokens

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What is a token, and why is it not a word?
- How many tokens is one typical NuraKnect DM?
- Why do non-English or emoji-heavy DMs cost more tokens?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 102 — Sampling: temperature, top-k and top-p

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What does temperature change about next-token choice?
- What does top-p do, and when would you change it?
- Which setting would you use for classification and which for reply drafts?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 103 — Embeddings (ML Crash Course)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What is an embedding in one sentence?
- Why does distance between vectors mean similarity of meaning?
- What could you embed in NuraKnect, and what would you compare it to?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 104 — Effective context engineering for AI agents

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What is the difference between prompt engineering and context engineering?
- What would you keep, summarise or drop from a long DM thread?
- What is your token budget per NuraKnect reply?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 105 — Context engineering lesson (hands-on)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What does your context assembler do when it is over budget?
- Where does summarisation lose important information?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 107 — Choosing a model (capability, cost, latency)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What three things decide your model choice?
- What is your test set for NuraKnect intent labelling?
- When is a bigger model worth the cost?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 108 — OpenAI API docs: text generation (closed model)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Which model and settings would you call first for NuraKnect?
- What does one 1,000-DM day cost with it?
- What data leaves your system?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 109 — Hugging Face LLM Course: Transformers models and open weights

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What does running an open-weights model change about cost, privacy and quality?
- What hardware would NuraKnect need to run one?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 111 — Project: Token and cost meter for NuraKnect DMs

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Script that prints tokens and cost per DM: (link or paste it here)
- A short table of 30 DMs with token counts: (link or paste it here)
- One paragraph: which prompt part costs the most: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 112 — Project: DM intent classifier with structured JSON

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Prompt file and JSON schema: (link or paste it here)
- Results table for 20 DMs at two temperatures: (link or paste it here)
- Notes on every label that changed: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 113 — Project: Model bake-off, hosted vs local

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Comparison table: accuracy, p50 latency, cost per 1,000 DMs: (link or paste it here)
- The 30-DM test set: (link or paste it here)
- A one-page recommendation for NuraKnect: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

