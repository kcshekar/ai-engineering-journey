# Layer 3 — Agents & Orchestration Notes
**Status:** Not Started
**Duration:** Weeks 7–10
**Items:** 15
**Quiz Score:** —
**Completed Date:** —

---

## c301 — Function Calling Deep Dive (tool-use loop)

*repo · core · 2 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Tool schema (name, description, JSON Schema)
- What makes a good tool description?
- Why do vague descriptions cause wrong tool calls?

#### The tool-use loop
- Who runs the tool, and what message carries the result back?
- What should the result look like when the tool fails?

#### Parallel and streaming tool calls
- When can the model ask for several tools at once?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Python Code — Dispatch a JSON Tool Call
```python
# Paste your working solution here
```

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c302 — The Agent Loop and ReAct

*repo · core · 2.5 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### The agent loop
- What are the steps of one iteration?
- What are all the ways the loop can stop?

#### ReAct
- What do Thought, Action and Observation each hold?
- Where does a ReAct loop go wrong?

#### Limits
- Why a max-steps guard, and what should happen when it trips?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Python Code — Build a ReAct Loop With a Mock LLM
```python
# Paste your working solution here
```

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c303 — Building Effective Agents (Anthropic)

*article · optional · 1 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Workflows vs agents
- When is a fixed workflow better than an agent?

#### The five patterns
- Which one fits DM triage: chaining, routing, parallelisation, orchestrator-workers, evaluator-optimiser?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c304 — Agent Memory: Context Windows and Virtual Memory

*repo · core · 2 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Short-term memory
- How does a sliding window decide what to drop?
- What must never be dropped?

#### Summaries and paging
- What does a running summary lose?
- When would you page old messages out and back in?

#### Memory for NuraKnect
- What must be remembered per DM thread, and for how long?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Python Code — Sliding-Window Memory With a Pinned System Message
```python
# Paste your working solution here
```

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c305 — Introduction to Model Context Protocol

*course · core · 2 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Host, client, server
- Who creates the client, and how many servers can one host use?

#### Tools, resources, prompts
- What is the difference, and who controls each?

#### Building a server
- How do you test a server before connecting a real host?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c306 — MCP Fundamentals and Building a Server

*repo · core · 2 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### JSON-RPC underneath
- What are requests, responses and notifications?
- Which methods does a client call first?

#### Transports
- When would you use stdio and when HTTP?

#### Server design
- Which NuraKnect data should be a resource and which an action should be a tool?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Python Code — A Tiny MCP-Style JSON-RPC Handler
```python
# Paste your working solution here
```

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c307 — Claude Agent SDK

*docs · core · 3 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Built-in tools and permissions
- What can the agent do by default and how do you limit it?

#### Hooks and subagents
- Where would you add a check before a tool runs?

#### Using MCP servers
- How would this SDK connect to your c314 server?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c308 — OpenAI Agents SDK

*docs · core · 3 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Agents and handoffs
- How would a triage agent hand off to a billing agent?

#### Guardrails and tracing
- What would you guard on input and what on output?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c309 — LangGraph

*docs · core · 3 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### State graphs
- What are nodes, edges and state?

#### Checkpoints and interrupts
- How does the graph pause for human approval and resume?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c310 — CrewAI

*docs · core · 3 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Roles, tasks and crews
- How do you define a role so it does not overlap another?

#### Control
- What can you not easily control in a crew compared with an explicit loop?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c311 — Multi-Agent Patterns: Supervisor and Orchestrator

*repo · core · 2.5 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Supervisor and handoffs
- What decides which agent runs next?

#### Cost of coordination
- What does each extra agent add in latency, tokens and failure points?

#### Failure modes
- How do agents amplify each other's mistakes?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c312 — Computer-Use and Browser Agents

*repo · optional · 1.5 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### Key Concepts

#### Computer-use agents
- How does the loop work with screenshots and clicks?

#### Safety
- What can go wrong, and what do you sandbox?

### What Surprised Me
(At least 2 things)

### What I Got Wrong Initially
(Be honest)

### Connection to NuraKnect
(How specifically does this apply to your DM assistant?)

---

## c313 — Project: DM Triage Agent With Mocked Tools

*project · core · 4 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### What I Built
(Describe what you built and how it works.)

### Evidence to Keep
- [ ] Repo link with a README and a sample run log
- [ ] The tool schemas (JSON) and the max-steps guard
- [ ] 3 DM examples with the tool calls the agent chose

### What Surprised Me

### What I Got Wrong Initially

### Connection to NuraKnect
(How does this change the product?)

---

## c314 — Project: MCP Server for NuraKnect Data and Tools

*project · core · 8 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### What I Built
(Describe what you built and how it works.)

### Evidence to Keep
- [ ] Server repo with a README showing how to connect a host
- [ ] Screenshot or log of a host calling your tools
- [ ] One paragraph on what the server must NOT expose and why

### What Surprised Me

### What I Got Wrong Initially

### Connection to NuraKnect
(How does this change the product?)

---

## c315 — Project: Multi-Agent Workflow With Human Approval and Eval

*project · core · 8 h*

### Summary
(Write 3–5 sentences in your own words. What was the main thing this taught you?)

### What I Built
(Describe what you built and how it works.)

### Evidence to Keep
- [ ] Diagram of the agents and the approval step
- [ ] Eval set (10+ DMs) with the task-success rate and failures listed
- [ ] Trace or log showing one approval pause and resume

### What Surprised Me

### What I Got Wrong Initially

### Connection to NuraKnect
(How does this change the product?)

---

## Layer 3 — Overall Insights

### The Three Most Important Things I Learned
1.
2.
3.

### Which Agent SDK I Picked and Why

### What I Would Not Let an Agent Do Without Approval

### Mistakes I Made That I Will Not Repeat

### Questions Still Unanswered
(Things to explore in the next layer)

---

## Layer 3 Quiz Results
| Question | Topic | Score |
|----------|-------|-------|
| Q1 | DM triage tool set | /10 |
| Q2 | Prompt injection via tools | /10 |
| Q3 | Memory choice | /10 |
| Q4 | Agent SDK choice | /10 |
| Q5 | Measuring task success | /10 |
| **Total** | | |
