# Layer 2 — Applied LLMs Notes
**Status:** In Progress
**Duration:** Weeks 4–6
**Courses:** 4
**Quiz Score:** —
**Completed Date:** —

---

## Course 5 — Building Systems with the ChatGPT API

### Summary
(Write 3–5 sentences summarising the course in your own words.
What was the main thing this course taught you?)

### Key Concepts

#### Multi-step LLM Chains
- What is a chain in the context of LLMs?
- How is a chain different from a single LLM call?
- How does this relate to what AutoGen does in the work platform?

#### Input/Output Moderation
- What is moderation and why does it matter in production?
- How would you add moderation to NuraKnect DM replies?

#### Chain of Thought in Chains
- How does chain of thought work at the system level, not just prompt?
- When would you use it in a work-platform workflow step?

#### Classification Chains
- How do you route different inputs to different processing paths?
- How does this map to NuraKnect's intent classification?

### What Surprised Me
(Write at least 2 things that were unexpected or clicked for you)

### What I Got Wrong Initially
(Be honest — what did you misunderstand and then correct?)

### Python Code — Real API Call
```python
# Paste your working NuraKnect DM classifier API call here
# Must use real OpenAI or Anthropic SDK
# Must return structured JSON
# Must handle errors with try/except
```

### Connection to My Products
**Work platform:** (How specifically does what you learned apply to
your AutoGen workflow orchestration? Be specific about which
part of the work-platform system this affects.)

**NuraKnect:** (How specifically does what you learned apply
to your DM manager? What feature did you build or improve?)

---

## Course 6 — Building and Evaluating Advanced RAG

### Summary
(Write 3–5 sentences. What is RAG at its core and why does it exist?)

### Key Concepts

#### What RAG Solves
- What problem does RAG solve that fine-tuning cannot?
- What are the two main failure modes RAG prevents?

#### Document Processing Pipeline
- What is chunking and why does chunk size matter?
- What chunking strategy would you use for NuraKnect DM history?
- What chunking strategy would you use for work-platform workflow docs?

#### Embedding Generation
- What is an embedding in plain English?
- Why do similar meanings cluster together in embedding space?
- Which embedding model would you use and why?

#### Retrieval
- What is similarity search and how does it work?
- What is the difference between top-k retrieval and threshold retrieval?
- What is reranking and when do you need it?

#### Augmented Generation
- How does retrieved context get added to the prompt?
- What is the risk of adding too much retrieved context?
- How do you handle the case where no relevant context is found?

### What Surprised Me

### What I Got Wrong Initially

### Python Code — RAG Pipeline Skeleton
```python
# Paste your RAG pipeline code here
# Should show: embed → store → retrieve → generate flow
```

### My RAG Design for NuraKnect
(Draw out in text or pseudocode exactly how RAG will work
for NuraKnect conversation memory. Be specific.)

### Connection to My Products
**Work platform:**
**NuraKnect:**

---

## Course 7 — LangChain for LLM Application Development

### Summary

### Key Concepts

#### LCEL — LangChain Expression Language
- What problem does LCEL solve?
- How is LCEL different from writing LLM calls manually?
- Write one example of a simple LCEL chain in pseudocode

#### Memory in LangChain
- What types of memory does LangChain support?
- Which memory type is best for NuraKnect DM conversations?
- How is LangChain memory different from RAG retrieval?

#### Tools and Agents in LangChain
- How does a LangChain agent decide which tool to use?
- How does this compare to how AutoGen assigns tools in the work platform?

#### LangChain vs AutoGen — Honest Comparison
- Where is LangChain better than AutoGen?
- Where is AutoGen better than LangChain?
- What does this mean for work-platform architecture going forward?

### What Surprised Me

### What I Got Wrong Initially

### Python Code

### Connection to My Products
**Work platform:**
**NuraKnect:**

---

## Course 8 — Vector Databases from Embeddings to Applications

### Summary

### Key Concepts

#### Why Vector Databases Exist
- Why can you not store embeddings in MongoDB or PostgreSQL?
- What makes vector databases different from traditional databases?

#### How Vector Search Works
- What is ANN (Approximate Nearest Neighbour) search?
- What is cosine similarity and why is it used for embeddings?
- What is dot product similarity and when is it better?

#### Qdrant Specifically
- How do you create a collection in Qdrant?
- What is a payload in Qdrant and how do you use it for filtering?
- What is hybrid search and when do you need it for NuraKnect?

#### Production Considerations
- How do you handle embedding model updates when vectors are stored?
- How do you measure retrieval quality in production?
- What is the cost model — when does a vector DB become expensive?

### What Surprised Me

### What I Got Wrong Initially

### Python Code — Qdrant Setup and Query
```python
# Paste your Qdrant collection setup here
# Should show: create collection → index documents → query
```

### My Vector DB Design for NuraKnect
(Describe the collection structure, payload schema,
and query strategy you would use for NuraKnect DM memory)

### Connection to My Products
**Work platform:**
**NuraKnect:**

---

# New items (roadmap v2)

## Item 201 — Hybrid search explained (BM25 plus vectors)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Why does vector search miss exact codes and names?
- How does reciprocal rank fusion merge two ranked lists?
- When would you weight keyword search higher?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 202 — Rerankers and two-stage retrieval

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Why is a cross-encoder slower but more accurate than embedding similarity?
- How many candidates would you rerank, and why?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 203 — Contextual retrieval

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What does the chunk-specific context look like for one NuraKnect FAQ chunk?
- How does prompt caching reduce the cost of generating it?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 204 — HyDE: hypothetical document embeddings

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What is a hypothetical document, and why does embedding it help?
- When could HyDE make results worse?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 211 — RAGAS: evaluating a RAG pipeline

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What do faithfulness, context precision and context recall each tell you?
- Which metric would you watch first for NuraKnect?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 207 — Qdrant quickstart

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- How do collections and payload filters work?
- What would you run locally, and what in production?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 208 — pgvector

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- When is Postgres plus pgvector enough?
- Which index (HNSW or IVFFlat) would you choose, and why?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 209 — Chroma getting started

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What is the smallest working Chroma example?
- What would make you move off Chroma?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 212 — Project: PDF Q&A with sources

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Repo with ingest and ask scripts: (link or paste it here)
- 10 test questions with answers and cited passages: (link or paste it here)
- Notes on one wrong answer and why: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 213 — Project: Hybrid search over NuraKnect DMs

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Index and query code: (link or paste it here)
- 10 queries with results for vector-only versus hybrid: (link or paste it here)
- Short note on where hybrid won or lost: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 214 — Project: Add a reranker and measure before and after

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- Before and after table on 20 queries: (link or paste it here)
- Latency added by the reranker: (link or paste it here)
- Decision: keep or drop the reranker: (link or paste it here)

### What I Built
(Describe it in 3–5 lines.)

### What I Would Change Next Time

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 205 — GraphRAG (Microsoft)

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- What problem does GraphRAG solve that plain RAG does not?
- What does indexing cost compared with plain chunking?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Item 206 — Building Agentic RAG with LlamaIndex

### Summary
(Write 3–5 sentences in your own words.)

### Key Concepts
- How does an agent decide when to retrieve?
- What can go wrong when the agent picks the wrong tool?

### What Surprised Me
(At least 1 thing.)

### Connection to NuraKnect
(How does this apply to your product?)

---

## Layer 2 — Overall Insights

### The Three Most Important Things I Learned
1.
2.
3.

### What Changed in How I Think About the Work Platform

### What Changed in How I Think About NuraKnect

### Mistakes I Made That I Will Not Repeat

### Questions Still Unanswered
(Things you want to explore further in Layer 3)

---

## Layer 2 Quiz Results
| Question | Topic | Score |
|----------|-------|-------|
| Q1 | Semantic vs keyword search | /10 |
| Q2 | RAG pipeline design | /10 |
| Q3 | Real API call code | /10 |
| Q4 | RAG vs fine-tuning | /10 |
| Q5 | Vector DB debugging | /10 |
| **Total** | | |
