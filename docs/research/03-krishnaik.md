# Krish Naik AI Tutorials: roadmap and tutorial UX research

Fetch date: 2026-11-23. Method: raw HTML via curl, then parsed the Next.js `__NEXT_DATA__` JSON, `robots.txt`, `sitemap.xml`, and the page JS chunks (`/_next/static/chunks/...`). Label key: **[V]** verified from fetched data or code, **[U]** unverified or inferred.

Pages studied:
- https://www.krishnaik.in/ai-tutorials/roadmap/agentic-ai-engineer
- https://www.krishnaik.in/ai-tutorials/langchain/setup?id=1-2,5-8,11&roadmap=agentic-ai-engineer&stop=lc-agent
- https://www.krishnaik.in/ai-tutorials (hub), plus roadmaps `ai-forward-deployed-engineer`, `ai-platform-llmops-engineer`
- Repo: https://github.com/krishnaik06/Roadmap-To-Learn-Agentic-AI (README, YouTube-playlist list only)

## 0. Key discovery: the whole site is server-rendered with full data in `__NEXT_DATA__` [V]

It is a Pages Router Next.js app (`/ai-tutorials/roadmap/[role]`, `/ai-tutorials/[framework]/[topic]`). `curl` returns the complete roadmap, all lesson block content, and the course outline as JSON in `<script id="__NEXT_DATA__">`. No login or browser is needed for roadmap or lesson content. `robots.txt` disallows only `/api/`, `/loginadmin`, `/tests/`, `/tutorials-draft/`. Sitemaps: `/sitemap.xml` (stale, 2025) and `/ai-tutorials/sitemap.xml` (current; lists per-course lesson and `/quiz/<part>` URLs).

Reproduce: `curl -sL -A "Mozilla/5.0" URL | python3 -c "import re,sys,json;print(json.dumps(json.loads(re.search(r'__NEXT_DATA__[^>]*>(.*?)</script>',sys.stdin.read(),re.S).group(1)),indent=1))"`.

## 1. URL scheme: "roadmap -> tutorial slice" [V, read from the page JS]

| Param | Meaning |
|---|---|
| `id=1-2,5-8,11` | Lesson ids of THIS course that the roadmap stop selects. Comma list with `a-b` ranges. Parser: strips `{}[] ` and whitespace, expands ranges (max 500 wide), sorts, dedupes. Writer re-compresses (`sK`/`_1`): sorted unique ids to ranges. `1-2,5-8,11` = lessons 1,2,5,6,7,8,11 (7 lessons, 39 min). |
| `roadmap=agentic-ai-engineer` | Roadmap slug. Only honored if it is in a known-slug map; otherwise ignored. Turns on "Back to roadmap" chrome and the return link. |
| `stop=lc-agent` | Id of the roadmap block (a "stop") the user came from. Used for the return URL `/ai-tutorials/roadmap/<slug>?stop=<id>` and the roadmap scrolls to `#stop-<id>` and flashes it (CSS class `flash`). |

Behavior when `id` is present [V]:
- Prev/next skips lessons outside the set (next = first in-set id greater than current; prev = last in-set id lower).
- Breadcrumb reads `<Roadmap title> roadmap · lesson N of M`.
- The side rail shows a "Roadmap focus" box with a toggle "Only these lessons" / "Show all lessons". In focus mode, parts with no in-set lesson are hidden, out-of-set rows get class `outfocus` (dimmed), in-set rows `infocus`, and the per-section quiz rows are hidden.
- Every lesson link in the rail and prev/next keeps the same query string (`?id=...&roadmap=...&stop=...`), so the slice survives navigation.
- "Mark complete" (last lesson in the slice): records lesson done, then goes to next in-set lesson, or, if none, `router.push(roadmapUrl?stop=<stop>)` (back to the roadmap at that stop).
- Without `id`: normal full-course prev/next. With a course but no roadmap: "Focused lessons" label (so `?id=` works standalone as a custom playlist).
- A roadmap block's `ref` is the same string without the leading `?` (e.g. `langchain?id=14,19,27`). Ref kinds seen: `framework?id=...` (lesson slice), `framework` (whole course), `project:<slug>`, `topic:<slug>`, and a `soon: true` stop (locked, "coming soon"). The server resolves each ref into `{type, framework, live, ids, pattern, lessons[{id,slug,title,minutes}], minutes, href}`.
- The same course appears several times in one roadmap with different slices (LangChain: `1-2,5-8,11` then `14,19,27` then `37-41`, `30-32`, `29`, `24`). Different roadmaps reuse the same lessons with different slices (e.g. FDE roadmap uses `langchain?id=1-2,5-7,11`). One lesson corpus, many composed paths.
- Lesson page URL = `/ai-tutorials/<framework>/<lesson-slug>`; lesson 0 is the course root `/ai-tutorials/<framework>`; section quiz = `/ai-tutorials/<framework>/quiz/<part-slug>`.

## 2. Roadmap content: Agentic AI Engineer [V]

Tagline: "Build an agent end to end on the LangChain stack, then make it safe and prove it works." Finish card: "Agentic AI engineer: One agent: built, guarded, measured and traced." 10 stages, 27 stops (blocks). Free; free Groq key plus free Gemini key (embeddings). Based on Krish Naik's *Complete Agentic AI Course In 10 Hours* and *Complete AI Security Course In 8 Hours* (YouTube); every lesson embeds the matching video clip.

Teaches: Agentic AI; LangChain agents and middleware; LangGraph workflows; Agentic RAG; MCP servers and tools; Agent memory with LangMem; Deep Agents; Guardrails with NeMo; RAG evaluation with RAGAS.

Stage object fields: `id, name, kicker, rank, color, intro, tools[{slug, role}], blocks[]`. Block fields: `id, ref, title, summary, why, learn[], checkpoint, uses[], soon`. There is no explicit prerequisite field; prerequisites are the linear order ("Every later stage assumes only the stages before it", per FAQ). No per-node level tag (levels appear only as the stage `rank` title and the course `level`). Time is derived from lesson minutes.


### Stage 1: Python and LLM basics  (kicker: "Before the agent"; rank earned: **Ready to build**; colour token: `accent`)

Every agent on this path is Python code that talks to a language model. This stage takes the core of two courses: enough Python to write functions, classes, Pydantic models and async code, and enough about models to know what tokens, temperature and a system prompt do to the answer you get back. It ends with a ticket sorter that sends real tickets to a real model and scores what comes back. Skip what you already know, but do the project either way.

Tools: `python-for-ai` (The language every lesson after this is written in. A tool is a Python function, a message is a dictionary, and a structured answer is a Pydantic model.); `llm-fundamentals` (How the model inside every agent behaves: tokens, temperature, messages, system prompts, structured output, context and cost. Its setup lesson gets you the free Groq key the later courses use.)

- **Python for agents** (`python`, ref `python-for-ai?id=1,3,7,9,12,17,20,25,27`) - 9 lessons, 50 min
  - Summary: Setup, variables, lists, dictionaries, functions, JSON, classes, Pydantic and async.
  - Why: These nine lessons are the Python the later courses use on every page. Lists and dictionaries hold messages, functions become tools, and Pydantic models check what a model sends back. The full course goes on to files, error handling, retries and pytest when you want them.
  - Learn: Lists and dictionaries, the shape of every message; Functions, which become tools; JSON in and out; Classes and Pydantic models; async and await
  - Checkpoint question: A model returns a JSON string. What turns it into a checked Python object, and what happens when a field is missing?
  - Lessons: 1 Installation and setup (4m); 3 Variables (5m); 7 Lists (5m); 9 Dictionaries (6m); 12 List comprehensions (5m); 17 import and modules (6m); 20 Stand-in model (6m); 25 Magic methods (7m); 27 dataclasses (6m)
- **How LLMs behave** (`llm`, ref `llm-fundamentals?id=1,3,6,10-11,13,15-16`) - 8 lessons, 50 min
  - Summary: A free Groq key, tokens, temperature, chat messages, system prompts, structured output, context and cost.
  - Why: Agents fail in ways that make sense once you know how the model works. Tokens set the bill and the context limit, temperature sets how much answers vary, and the system prompt is where an agent's instructions live. The setup lesson gets you the free Groq key every later course uses.
  - Learn: Tokens and the context window; Temperature and repeatable answers; Chat messages and system prompts; Structured output; What a call costs
  - Checkpoint question: Your app gives a different answer to the same question on every run. Which setting do you check first?
  - Lessons: 1 Installation and setup (5m); 3 Tokens (6m); 6 Temperature (6m); 10 Chat messages and templates (7m); 11 System prompts (7m); 13 Structured output (6m); 15 Context window (7m); 16 Cost (6m)
- **Checkpoint: ticket sorter** (`project-sorter`, ref `llm-fundamentals?id=18`) - 1 lessons, 10 min
  - Summary: Sort labelled support tickets with a real model and report accuracy, tokens, cost and time.
  - Why: The first hands-on test: a prompt in its own file, a real model and a score you can compare across two versions of the prompt. Support tickets come back at the end of the roadmap, handled by a full agent.
  - Learn: A prompt kept in its own file; Sorting a batch of tickets; Accuracy, tokens, cost and time; Comparing two prompts on the same tickets
  - Checkpoint question: The new prompt scores higher on seven tickets. Is that enough to ship it?
  - Lessons: 18 Project: ticket sorter (10m)

### Stage 2: LangChain agents  (kicker: "Your first agent"; rank earned: **Agent builder**; colour token: `d1`)

LangChain is where the agent appears. You start with messages and a chat model, turn Python functions into tools, and hand both to create_agent, which runs the loop: call the model, run the tool it picked, call the model again, until it has an answer. Then you give the agent short-term memory, middleware around every model call, and a pause for a person before a risky tool runs. The stage ends with the desk project, an assistant you build, guard and test across five short lessons.

Tools: `langchain` (The agent in a few lines: chat models, tools, create_agent, structured output, memory and middleware. Every later course on this path builds on its message and tool types.)

- **Messages, tools and create_agent** (`lc-agent`, ref `langchain?id=1-2,5-8,11`) - 7 lessons, 39 min
  - Summary: Chat messages, invoke and stream, tools, bind_tools, the agent loop and typed answers.
  - Why: This is the core of the course and of the LangChain part of the Complete Agentic AI Course: one model, a few tools, and the loop that joins them. Structured output means the agent's final answer is a typed object, not text you have to parse.
  - Learn: Messages, invoke, batch and stream; @tool and bind_tools; create_agent and its loop; Structured output from an agent
  - Checkpoint question: The agent calls the same tool three times for one question. Where would you look to see why?
  - Lessons: 1 Installation and setup (4m); 2 Messages (5m); 5 invoke, batch and stream (5m); 6 Tools (5m); 7 bind_tools (7m); 8 create_agent (7m); 11 Structured output (6m)
- **Memory, middleware and approval** (`lc-control`, ref `langchain?id=14,19,27`) - 3 lessons, 19 min
  - Summary: Keep a conversation together, run code around every model call, and stop for a person before a risky tool.
  - Why: A demo agent forgets everything and runs every tool it picks. Short-term memory keeps one thread together, middleware is the hook for checks and limits, and human-in-the-loop pauses the run until someone approves. The full course adds summarization, call limits and more built-in middleware.
  - Learn: A checkpointer and thread ids; Middleware around the model call; Pausing before a tool runs; Approve, edit or reject
  - Checkpoint question: Two customers talk to the agent at the same time. What keeps their conversations apart?
  - Lessons: 14 Short-term memory (6m); 19 Middleware (6m); 27 Human-in-the-loop (7m)
- **Checkpoint: the desk project** (`lc-desk`, ref `langchain?id=37-41`) - 5 lessons, 32 min
  - Summary: A shop assistant with three tools, four guards, a morning of real requests, saved threads and tests.
  - Why: Five short lessons that put the stage into one working assistant: tools that look up orders and policy, middleware that blocks, masks and pauses refunds, and tests that run in under a second, so you know it still works after the next change.
  - Learn: Tools that read runtime context; Four guards as middleware; A refund that waits for approval; Threads and pytest tests
  - Checkpoint question: Which of the desk's tests would fail first if you swapped the model?
  - Reuses: langchain
  - Lessons: 37 Project: desk tools (7m); 38 Project: desk guardrails (6m); 39 Project: a morning at the desk (7m); 40 Project: desk threads (5m); 41 Project: desk tests (7m)

### Stage 3: LangGraph workflows  (kicker: "Control the flow"; rank earned: **Graph builder**; colour token: `d2`)

create_agent hides the loop. LangGraph shows it. You write the agent as a graph: a state object, nodes that read and update it, and edges that decide what runs next, including branches and loops. Then you build the agent loop yourself, save every step with a checkpointer, pause it with an interrupt, stream its progress, and put a supervisor over several agents. The support agent at the end is the base the capstone grows from.

Tools: `langgraph` (Agents as explicit graphs of state, nodes and edges, with checkpoints, interrupts and streaming built in. create_agent runs on it, and so does every agent from here to the capstone.)

- **State, nodes and edges** (`lg-graph`, ref `langgraph?id=2-5,7,10-11`) - 7 lessons, 54 min
  - Summary: A typed state, nodes that update it, and edges that branch and loop.
  - Why: Every LangGraph program has the same three parts. Once you can draw the graph, conditional edges and Command choose the route, and the recursion limit stops a loop that would never end.
  - Learn: State as a TypedDict; StateGraph, nodes and edges; Conditional edges; Command, loops and the recursion limit
  - Checkpoint question: Your graph bounces between two nodes forever. What stops it, and what do you see when it does?
  - Lessons: 2 State (8m); 3 StateGraph (10m); 4 Nodes (8m); 5 Edges (4m); 7 Conditional edges (15m); 10 Command (4m); 11 Loops and recursion limit (5m)
- **The agent loop: saved, paused, streamed** (`lg-agent`, ref `langgraph?id=20,22,26,28`) - 4 lessons, 44 min
  - Summary: Write the agent loop as a graph, save each step, pause for a person, and stream progress.
  - Why: Here you write the loop yourself: a model node, a tool node and the edge between them. A checkpointer saves the state after every step, which is what makes an interrupt possible, and streaming shows each step as it happens instead of after the whole run.
  - Learn: The agent loop as a graph; Checkpointer and threads; interrupt() and resuming; Streaming updates and tokens
  - Checkpoint question: A run is paused at an interrupt and the server restarts. What has to be saved for it to resume?
  - Lessons: 20 Agent loop (11m); 22 Checkpointer (12m); 26 Interrupts (10m); 28 Streaming (11m)
- **Multi-agent supervisor** (`lg-supervisor`, ref `langgraph?id=31`) - 1 lessons, 15 min
  - Summary: One agent routes each request to a specialist and collects the answer.
  - Why: When one prompt has to do too much, split it. A supervisor decides which specialist handles the request. Reach for it when the split makes the system easier to follow, not by default.
  - Learn: Specialist agents as nodes; A supervisor that routes; Handing results back; When one agent is enough
  - Checkpoint question: A question needs both the billing and the shipping specialist. What does the supervisor do?
  - Lessons: 31 Multi-agent supervisor (15m)
- **Checkpoint: support agent** (`lg-project`, ref `langgraph?id=32`) - 1 lessons, 7 min
  - Summary: One graph that reads a ticket, looks things up, remembers the thread and pauses before a refund.
  - Why: The stage in one graph: a tool lookup, memory across turns, a clean answer when an order does not exist, and a human approval before any refund. Keep this code, because the capstone starts from it.
  - Learn: The model node and the tool node; Memory across turns; Handling an order it cannot find; Approval before a refund
  - Checkpoint question: Which node would you test first, and with what input?
  - Reuses: langgraph
  - Lessons: 32 Project: support agent (7m)

### Stage 4: Retrieval and RAG  (kicker: "Answer from your documents"; rank earned: **Retriever**; colour token: `d3`)

A support agent that makes up a refund policy is worse than no agent. Retrieval-augmented generation fixes that: split your documents, turn the pieces into vectors, store them, and let the agent search them before it answers. You build it twice, as a retrieval tool for a LangChain agent and as nodes in a LangGraph graph that can refuse when it finds nothing, which is the shape the capstone uses.

Tools: `langchain` (Loaders, text splitters, embeddings, vector stores and a retrieval tool the agent calls like any other.); `langgraph` (Retrieval as a node in the graph, so the flow decides when to search and what to do when the search comes back empty.)

- **Documents to a retrieval tool** (`lc-rag`, ref `langchain?id=30-32`) - 3 lessons, 18 min
  - Summary: Split documents, embed and store the chunks, and give the agent a search tool.
  - Why: Three lessons from a raw document to an agent that searches it. You see what an embedding and a vector store are by building small ones, then wrap the retriever as a tool so the agent decides when to look something up.
  - Learn: Loaders and text splitters; Embeddings and a vector store; A retriever and its scores; A retrieval tool the agent calls
  - Checkpoint question: Chunks are too large and the answer is buried in them. What do you change, and how do you know it helped?
  - Lessons: 30 Documents and text splitting (5m); 31 Embeddings and vector stores (6m); 32 Retrieval tool (7m)
- **Checkpoint: agentic RAG in a graph** (`lg-rag`, ref `langgraph?id=33-34`) - 2 lessons, 16 min
  - Summary: A decide, retrieve and generate graph that grounds its answer or says it has nothing to go on.
  - Why: The same idea with the flow in your hands: decide whether a question needs the documents, retrieve, and answer only from what came back. This is the retrieval half of the capstone.
  - Learn: A small retriever you can read; Decide, retrieve and generate nodes; Grounded answers; Refusing when nothing matches
  - Checkpoint question: Retrieval returns nothing useful. What should the graph do instead of answering anyway?
  - Reuses: langgraph
  - Lessons: 33 Retrieval (8m); 34 RAG (8m)

### Stage 5: MCP tools and long-term memory  (kicker: "Reach out and remember"; rank earned: **Connector**; colour token: `purple`)

Two things turn a support agent into a useful one: tools that live outside its code, and memory that outlasts one conversation. MCP puts tools behind a standard server, so any agent can call them over stdio or HTTP. LangMem pulls facts and events out of conversations and stores them, so the agent can search them next time. Each course has its own project as the checkpoint.

Tools: `mcp` (The standard way to put tools behind a server any agent or host can connect to. The capstone's order and refund tools live on an MCP server.); `langmem` (Long-term memory for LangGraph agents: extract what is worth keeping, store it with semantic search, and let the agent manage its own memories. Its setup lesson adds the free Gemini key for embeddings.)

- **MCP servers and clients** (`mcp-core`, ref `mcp?id=1,3-4,17-18,21,23`) - 7 lessons, 42 min
  - Summary: Build a server, call it from a client over stdio and HTTP, and let a model use its tools in a loop.
  - Why: With MCP, tools stop being functions pasted into each agent and become a server any host can connect to. The core lessons cover the server, the client, both transports and an agent loop over MCP tools. Resources, prompts, elicitation and testing are in the full course.
  - Learn: A server with MCPServer; A client that lists and calls tools; stdio and Streamable HTTP; An agent loop over MCP tools
  - Checkpoint question: When do you run a server over stdio, and when over Streamable HTTP?
  - Lessons: 1 Installation and setup (5m); 3 MCPServer quickstart (6m); 4 MCP client (6m); 17 stdio transport (6m); 18 Streamable HTTP transport (6m); 21 MCP tools with an LLM (6m); 23 Agent loop (7m)
- **Checkpoint: MCP support desk** (`mcp-project`, ref `mcp?id=26`) - 1 lessons, 10 min
  - Summary: An MCP server and an agent over HTTP, with refunds a supervisor must approve.
  - Why: The course in one build: the support tools on a server, an agent that reaches them over HTTP, and an approval step on the server side so no client can skip it. The capstone's tools work the same way.
  - Learn: Support tools on one server; An agent over HTTP; Server-side approval for refunds; Tests for the server
  - Checkpoint question: Why put refund approval on the server rather than trust the client to ask?
  - Reuses: mcp
  - Lessons: 26 Project: MCP support desk (10m)
- **Long-term memory with LangMem** (`langmem-core`, ref `langmem?id=1-2,5,8-10,13,15`) - 8 lessons, 66 min
  - Summary: Extract memories, keep them in collections, store them with semantic search, and give the agent memory tools.
  - Why: Short-term memory ends with the thread. LangMem decides what is worth keeping, stores it in a LangGraph store you can search by meaning, and lets an agent save and look up its own memories. Profiles, background managers and prompt optimization are in the full course.
  - Learn: Extracting memories from a chat; Collections and episodic memory; The LangGraph store and semantic search; Memory tools for an agent; Running summaries
  - Checkpoint question: A memory search returns a fact about a different user. What in your store should have prevented it?
  - Lessons: 1 Installation and setup (6m); 2 Extracting memories (9m); 5 Collections (9m); 8 Episodic memory (9m); 9 The LangGraph store (7m); 10 Semantic search (8m); 13 Agent memory (9m); 15 Running summaries (9m)
- **Checkpoint: support assistant that remembers** (`langmem-project`, ref `langmem?id=18`) - 1 lessons, 12 min
  - Summary: An agent that answers from memory in the chat and writes new memories after it.
  - Why: Monday's conversation shapes Friday's answer. The project splits the work in two: the agent reads memory while it answers, and a manager writes memories once the chat is over, so the reply is never slowed down by it.
  - Learn: Reading memory during the chat; Writing memory after it; A store shared across conversations; What to keep and what to drop
  - Checkpoint question: Should a memory be written during the reply or after it? What does each choice cost?
  - Reuses: langmem, langgraph
  - Lessons: 18 Project: support assistant (12m)

### Stage 6: Deep Agents  (kicker: "Plan, delegate, write it down"; rank earned: **Deep agent builder**; colour token: `d4`)

Some tasks are too long for a single loop. The agent needs a plan, somewhere to keep notes, and helpers it can hand parts of the work to. Deep Agents builds that on LangGraph: create_deep_agent comes with a todo list, a virtual filesystem and subagents, and you add backends, AGENTS.md memory, skills and human approval.

Tools: `deep-agents` (An agent harness on LangGraph with planning, a filesystem, subagents and approval built in, for tasks that run longer than one prompt can hold.)

- **Planning, files and subagents** (`deep-core`, ref `deep-agents?id=1,3-4,7-8,13-15,17,20`) - 10 lessons, 69 min
  - Summary: create_deep_agent, write_todos, the virtual filesystem, backends, AGENTS.md, skills, subagents and approval.
  - Why: A deep agent keeps its plan and its notes outside the conversation, so a long task does not drown its own context. These lessons cover each piece the harness gives you. Streaming, permissions and custom middleware are in the full course.
  - Learn: create_deep_agent and its built-in tools; Planning with write_todos; The virtual filesystem and backends; AGENTS.md memory and skills; Subagents and human approval
  - Checkpoint question: A research task outgrows the context window. Which built-in piece do you lean on first?
  - Lessons: 1 Installation and setup (5m); 3 create_deep_agent (7m); 4 Built-in tools (6m); 7 Planning with write_todos (7m); 8 Virtual filesystem (7m); 13 CompositeBackend (7m); 14 Memory with AGENTS.md (7m); 15 Skills (7m); 17 Subagents (8m); 20 Human-in-the-loop (8m)
- **Checkpoint: trip planner** (`deep-project`, ref `deep-agents?id=26`) - 1 lessons, 12 min
  - Summary: One request, a to-do list, two subagents, an itinerary file and a booking that waits for approval.
  - Why: The project from the Complete Deep Agents Course, rebuilt: the agent plans a budget trip, splits research between subagents, writes the plan to a file, and stops before it books. It also shows what happens when the catalog has no data for a city.
  - Learn: Planning a multi-step task; Two subagents with their own jobs; An itinerary written to a file; A booking that needs your yes
  - Checkpoint question: The user asks for a city the catalog does not have. What should the planner do?
  - Reuses: deep-agents
  - Lessons: 26 Project: trip planner (12m)

### Stage 7: Guardrails and safety  (kicker: "Keep it on topic and safe"; rank earned: **Guardian**; colour token: `d5`)

From here the path follows the Complete AI Security Course. An agent that answers anything will answer the wrong things: off-topic questions, jailbreaks, requests that leak data. You start with LangChain's guardrails middleware, then move to NeMo Guardrails, where rules live in a config folder: input rails check a message before the model sees it, output rails check the answer before the user does, and dialog rails fix how whole kinds of message are answered.

Tools: `langchain` (Guardrails as middleware: PII redaction and your own checks before and after the model, in code you already know.); `nemo-guardrails` (Rails in a config folder written in Colang: input, output and dialog rails that block, rewrite or answer without calling the model. The capstone's checks run on it.)

- **Guardrails middleware** (`lc-guard`, ref `langchain?id=29`) - 1 lessons, 6 min
  - Summary: PIIMiddleware and a check of your own around the agent.
  - Why: The quickest guardrail is one you already know how to write: middleware that checks input before the model and output after it. It shows what a guardrail does before NeMo gives you a framework for it.
  - Learn: PIIMiddleware on a card number; A before_agent check that ends a request; Redact, mask, hash or block; Layering guardrails
  - Checkpoint question: A guardrail blocks a message. What should the user see, and what should your log record?
  - Lessons: 29 Guardrails (6m)
- **Rails with NeMo Guardrails** (`nemo-core`, ref `nemo-guardrails?id=1,4,8-10,14,22,25`) - 8 lessons, 51 min
  - Summary: A config folder, Colang intents and flows, input rails, output rails and dialog rails.
  - Why: NeMo keeps safety rules out of your prompt and in a config folder you can read and review. The Colang lessons teach intents and flows, and input and output rails are the two checks the capstone runs on every message. Actions, tracing and the rail library are in the full course.
  - Learn: The config folder; define user, define bot and define flow; Input rails; Output rails; Dialog rails
  - Checkpoint question: An input rail blocks a fair question. Which part of the config do you change first?
  - Lessons: 1 Installation and setup (5m); 4 Config folder (6m); 8 define user and define bot (8m); 9 define flow (7m); 10 Stacking flows (7m); 14 Input rails (6m); 22 Output rails (6m); 25 Dialog rails (6m)
- **Checkpoint: guarded IT assistant** (`nemo-project`, ref `nemo-guardrails?id=36`) - 1 lessons, 8 min
  - Summary: A gate that runs every message through the rails and reports what fired.
  - Why: The course ends in the piece an application actually calls: a gate in front of the expensive work that returns whether the message passed, the reply, and which rails fired. It also shows the failure to watch for, a refusal that counts as a pass.
  - Learn: A gate before the model; Which rails fired; A refusal that slips through as passed; Where the gate sits in an app
  - Checkpoint question: How would you catch a refusal that the gate reports as passed?
  - Reuses: nemo-guardrails
  - Lessons: 36 Guarded IT assistant (8m)

### Stage 8: Evaluation with RAGAS  (kicker: "Prove it answers well"; rank earned: **Evaluator**; colour token: `d2`)

A guarded agent can still be wrong. RAGAS measures how wrong. You write goldens, questions with answers you trust, run the RAG app over them, and score each answer for faithfulness to what was retrieved, relevance to the question, and correctness. Then you run it as an experiment you can compare later and wire it into CI, so a bad change fails before it ships.

Tools: `ragas` (Metrics for RAG and LLM apps: faithfulness, answer relevancy, context precision and recall, and answer correctness, judged by a model. The capstone is scored with it.)

- **Scoring RAG with RAGAS** (`ragas-core`, ref `ragas?id=1-2,4,8-9,11-15,20,25`) - 12 lessons, 98 min
  - Summary: Goldens, a model as judge, the five core RAG metrics, experiments and evals in CI.
  - Why: These lessons are the evaluation loop from start to finish: what to test against, how a judge model scores, what each metric catches, and how to run the suite on every change. Custom metrics, datasets and the legacy API are in the full course.
  - Learn: Goldens you can trust; LLM as a judge; Faithfulness and answer relevancy; Context precision and recall; Experiments and evals in CI
  - Checkpoint question: Faithfulness is high but answer correctness is low. What is going wrong?
  - Lessons: 1 Installation and setup (6m); 2 LLM evaluation (6m); 4 Goldens (7m); 8 LLM as a judge (9m); 9 RAGAS metrics (7m); 11 Faithfulness (9m); 12 Answer relevancy (9m); 13 Context precision (9m); 14 Context recall (10m); 15 Answer correctness (10m); 20 Experiments (8m); 25 Evals in CI (8m)
- **Checkpoint: TechNest evaluation** (`ragas-project`, ref `ragas?id=27`) - 1 lessons, 15 min
  - Summary: Run the RAG app over five goldens and report every metric per golden.
  - Why: The whole suite in one run: the app answers each golden, RAGAS scores every answer on five metrics, and the report shows which question failed and why. The capstone reuses this to score the support agent.
  - Learn: The two-phase pipeline; Five metrics in one run; A report per golden and per metric; Where to extend the suite
  - Checkpoint question: One golden scores low on context recall only. Is the fix in retrieval or in the prompt?
  - Reuses: ragas
  - Lessons: 27 Project: TechNest support bot evaluation (15m)

### Stage 9: Production  (kicker: "Ship it and watch it"; rank earned: **Shipper**; colour token: `d1`)

The last thing to learn is running the agent for real. A model gateway puts one endpoint in front of every provider. LangGraph's deploy lesson serves the graph locally with a config file, LangSmith records every run so you can read it back, and LangChain's retry and fallback middleware keeps one provider's bad minute from taking the agent down.

Tools: `litellm` (A model gateway: one endpoint in front of every provider, with routing, fallbacks and cost tracking. The course is coming soon.); `langgraph` (langgraph dev and langgraph.json serve the graph, and LangSmith traces every step of every run.); `langchain` (Retry and fallback middleware, so a failed model call is tried again or moved to another model.)

- **Model gateway with LiteLLM** (`litellm`, ref `litellm`, SOON/locked) 
  - Summary: One endpoint for every provider, with routing, fallbacks and cost tracking.
  - Why: This course is coming soon in the new video-grounded format, so the stop is locked for now. A model gateway sits between your agent and the providers: every call goes to one endpoint, which routes it to the right model, falls back to another when one is down or rate limited, and records what each call cost. You can finish the roadmap without it and come back when it opens.
  - Learn: One call shape for every provider; Routing between models; Fallbacks when a provider fails; Cost tracking and budgets
  - Checkpoint question: Groq rate-limits you in the middle of a demo. What should a gateway do with the next request?
- **Retries and fallbacks** (`lc-retry`, ref `langchain?id=24`) - 1 lessons, 5 min
  - Summary: Call the model again after a failure, or move the request to another model.
  - Why: Free tiers rate-limit and providers have bad minutes. ModelRetryMiddleware tries the same model again, and ModelFallbackMiddleware moves on to another one, so the agent degrades instead of failing.
  - Learn: What happens with no handling; ModelRetryMiddleware; ModelFallbackMiddleware; When to retry and when to fall back
  - Checkpoint question: Retries make a slow failure slower. When should you fall back straight away instead?
  - Lessons: 24 Model retry and fallback (5m)
- **Checkpoint: deploy and trace with LangSmith** (`lg-ship`, ref `langgraph?id=36-37`) - 2 lessons, 16 min
  - Summary: Serve the graph with langgraph dev and record every run in LangSmith.
  - Why: Two short lessons that move the agent off your notebook: a langgraph.json file and one command give you a local server, and two environment variables turn on tracing with no code change. When a user says the agent did something odd, the trace is where you look.
  - Learn: langgraph dev and langgraph.json; Required and optional config fields; Tracing with two environment variables; Reading a run step by step
  - Checkpoint question: A user reports a wrong refund answer from yesterday. How do you find that exact run?
  - Lessons: 36 Deploy (9m); 37 LangSmith (7m)

### Stage 10: Capstone  (kicker: "Everything in one agent"; rank earned: **Agentic AI engineer**; colour token: `gold`)

One support agent that uses everything on this path. It is a LangGraph graph that answers from your policy documents, calls order and refund tools over MCP, remembers each customer with LangMem, runs every message through NeMo input and output rails, and stops for a person before any refund. You score it with RAGAS on a set of goldens and trace every run in LangSmith. When it is done, you have built the job this roadmap is named after.

Tools: `langgraph` (The graph that holds the agent together: retrieval, tools, memory and the approval step.); `mcp` (The order and refund tools, on a server the agent connects to.); `langmem` (What the agent remembers about each customer between conversations.); `nemo-guardrails` (Input rails before the graph and output rails before the reply.); `ragas` (The score on a set of goldens that says whether a change made the agent better or worse.)

- **Agentic support capstone** (`capstone`, ref `project:agentic-support-capstone`) - 0 lessons, 8 min
  - Summary: A guarded, remembering, measured support agent built from every stage.
  - Why: Each stage gave you one piece. Here they meet in one system with a clear definition of done, which is what you show when someone asks what you can build. Start from the LangGraph support agent and add one piece at a time.
  - Learn: RAG over policy documents; Tools over MCP and memory with LangMem; Rails and human approval; A RAGAS score and LangSmith traces
  - Checkpoint question: Your RAGAS score drops after you add the output rail. How do you find out whether the rail or the agent is to blame?
  - Reuses: langgraph, langchain, mcp, langmem, nemo-guardrails, ragas

Sum of resolved lesson minutes across stops: **772 min (~12.9 h)** [V, computed]. Capstone is a project stop with no lesson list in the roadmap payload (project page not fetched [U]).

### Roadmap FAQ [V]

- **What does an agentic AI engineer do?** They build applications where a language model decides the next step: which tool to call, what to look up, what to remember, and when to stop and ask a person. The job covers the agent itself, the retrieval and tools it depends on, the rails that keep it on topic, and the evaluation that shows its answers are right.
- **Can I start this roadmap as a beginner?** Yes. The first stage is the core of Python for AI and LLM Fundamentals, so you start from variables and lists and learn what a token and a system prompt are before you build an agent. Every later stage assumes only the stages before it.
- **Do I need an API key or a paid model account?** You need free keys, not paid ones. A free Groq key runs the chat model across the courses, and a free Gemini key from Google AI Studio covers embeddings in the memory and evaluation lessons. No lesson needs an OpenAI key. Claude Code is an optional companion for writing and fixing code as you go; it needs a paid plan, and nothing on this path depends on it.
- **How is this different from the AI Forward Deployed Engineer roadmap?** This roadmap is about building agents: it goes deep on one stack, LangChain, LangGraph, LangMem, Deep Agents, MCP, NeMo Guardrails and RAGAS, in the order the channel's courses teach it, so each stage builds on the code from the one before. The AI Forward Deployed Engineer roadmap uses the same agent skills inside a wider six-month path that adds software foundations, deployment, enterprise integration and the consulting work of shipping a system for a client.
- **Why does the LiteLLM stop say coming soon?** The LiteLLM course is being rebuilt in the same video-grounded format as the rest of this path, so its stop is locked until it is ready. You can finish the roadmap without it by marking the stop done by hand, and the course opens in the same place when it is finished.
- **Where do the videos come from?** From Krish Naik's YouTube channel, mostly the Complete Agentic AI Course In 10 Hours and the Complete AI Security Course In 8 Hours. Each lesson embeds the part of the video that covers the same idea, and the code under it is run against current library versions, so where a library has changed since the recording, the lesson says what changed.

### Per-tool card data on the roadmap page [V]
Each tool (`frameworks` map) has `name, by, logo, overview, pick[], skip[]` ("pick this if / skip if"). Example, LangGraph overview: "LangGraph is LangChain's framework for building agents and workflows as an explicit graph, released in 2024 and open-source under the MIT licence. Instead of one hidden loop, you define nodes that do the work and edges that decide what runs next, so branches, retries and steps that must not repeat a..."

Other roadmaps linked at the bottom: AI Forward Deployed Engineer (6 stages), AI Platform and LLMOps Engineer (10 stages).

## 3. Other roadmaps (same schema, same lesson corpus) [V]

**AI Forward Deployed Engineer** (6 stages, "Six projects, one client capstone"): month-based, each block labelled "Week N: ...". Stages: Foundations (Month 1, rank "Backend ready"), LLM Engineering (Month 2, "LLM engineer"), Agentic AI (Month 3, "Agent engineer"), Production & Deployment (Month 4, "Shipper"), Enterprise Integration (Month 5, "Enterprise integrator"), plus a sixth stage (client delivery/capstone; not printed here [U]). Each month ends with a project stop (`project:document-qa-api`, `policy-assistant-with-citations`, `ops-workflow-agent`, `deployed-agent-platform`, `secure-enterprise-copilot`). Many stops are `soon` (packaging, SQL, Docker, Kubernetes, Terraform, vLLM, compliance...). It also uses `topic:<slug>` stops (e.g. `topic:golden-datasets`, `topic:sso-oauth-and-rbac`) that are prose topics instead of a lesson slice.

**AI Platform and LLMOps Engineer** (10 stages): Python/Git/LLM behaviour -> What LLMOps is -> Plan the build -> Structure the app for production -> One gateway in front of every model (LiteLLM) -> Track experiments and prove quality (MLflow, RAGAS, DeepEval) -> Observability (Langfuse, gateway metrics) -> Containers, cloud and CI/CD -> Guardrails, governance and data -> Keep it healthy and hand it over. Ends in the BrandGuardian project and "Capstone: build your own". Rank per stage: Ready to operate, Knows the lifecycle, Can scope a build, Ships a real repo, Runs the gateway, Measures the model, Sees everything, Deploys to the cloud, Keeps it safe, Platform engineer.

Pattern worth copying: a rank (role title) per stage, one runnable "checkpoint/project" per stage, and a final capstone that explicitly lists which stages it uses (`uses[]`).

## 4. Hub page /ai-tutorials [V]

`pageProps`: `categories`, `frameworks` (54 entries: slug, name, by, logo, group, blurb, ready, pick[], plan[]), `lessonTotals`, `courseFacts` (lessons, minutes, parts, level, video, tagline, outcomes, partNames, prereq), `roadmapFacts`, `interviewFacts` (7 interview-question banks, each question tagged `level: easy|intermediate|hard`, `qtype`, `minutes`), `labs`. Categories (with a "hot" flag): Where to start, Coding agents, General frameworks, Graph and workflow, Vendor SDKs, Multi-agent, Evals and testing, Guardrails, Red teaming, Memory, Data and RAG, Document parsing, Web data and search, Vector database, Observability, Protocols and tools, Typed output, Prompt optimisation, Browser and computer use, Sandboxes, Voice, Autonomous, Agent product, Visual and no code, Inference and serving, Infrastructure, Fine-tuning, courses, interview. Full courses (lessons/min): Python for AI 43/289, ML 52/611, Deep Learning 41/483, NLP 52/656, Statistics 57/655, EDA 72/896, MLOps 50/473, LLMOps 50/391, Git 26/310, AI Security 52/551, Generative and Agentic AI 48/709. Only some frameworks are `ready`.

## 5. Tutorial (lesson) UX: /ai-tutorials/langchain/setup [V unless marked]

Data model: `course {slug, title, level (Beginner), targets ("LangChain 1.4 · Python 3.12+"), updated ("27 Sep, 2026"), prereq, summary, tagline, outcomes[5], docs, logo, channel, parts[{name, slug, topics[ids], quizCount:5}], topics[{id, slug, title, seoTitle, minutes}]}`. LangChain = 46 lessons (id 0..45) in 8 parts (Your first agent, Tools in depth, Memory, Middleware, Safety, Knowledge and outside tools, The project: a support desk, Off the stand-ins), each part followed by a 5-question "Section quiz" row.

Lesson body = ordered `blocks[]`; block types seen: `lead, p, h2 (optional badge e.g. "Recommended"), h3, video, tabs, example, code, table, callout, list, tryit`. Flag `ytc: true` marks content derived from the YouTube course (the page says where the video's code is outdated: "the video recorded gpt-5/qwen3-32b; here every example runs on Groq free openai/gpt-oss-120b"). Every lesson has a "Last updated" line and pinned versions (`langchain==1.4.2`). "Related" list gives Previous/Next/Reference.

Layout (desktop): top bar (brand, course name + targets, Dashboard, Feedback, overall % with progress bar `hprog`), left **rail** (course outline grouped by part; each part collapsible with `done/total` counter; rows = two-digit number or check mark when done, title, "N min"; active row `aria-current=page`; part ends with a quiz row with its own node), main `doc` column, optional right **editor** pane. The rail can be hidden (`krishnaik.tutorial.railhidden`); the editor width is draggable (`editorwidth`, default 560px, min 380, max 62% of viewport). Under 900px the rail collapses (mobile flag) and under 1180px a narrower layout is used; mobile CSS reduces h1 to 24px, body 15px, code 12.2px, editor height `calc(100dvh - 124px)`. "Scroll sideways to see the whole map" appears for wide diagrams.

Interactive parts:
- **Video clips**: YouTube embed with `start`/`end` seconds, poster before play (`clip-poster`, `clip-play`), meta "9:31 to 12:57", title "<topic> · from the Complete Agentic AI Course In 10 Hours", "End of clip" state, optional note. Clips are trimmed to the segment that matches the lesson.
- **Code blocks**: language label, **Copy** button, Prism-style syntax tokens; `norun` flag for non-runnable (e.g. `.env`); optional caption filename. Install **tabs** (pip / uv / Colab; macOS-Linux / PowerShell / cmd) whose selection is remembered across all tabs on the site (`coding-labs:code-tab` in localStorage, broadcast by a `code-tab` event).
- **Runnable examples** (`example` block): code + pre-recorded real **output** (tagged `live` when it is a real model call), Run button, "Edit any cell and run it on our servers — nothing to install" (POST `/api/lab/run` with a Bearer token, so running probably requires sign-in [code read, behaviour U]); states: running with caret, "No output.", "Not run — a cell above this one stopped with an error.", "Output was truncated.", "needs your key" ("Waiting for a key. Add one from the ⋯ menu"; keys kept "in this browser tab only. Sent with a run, never stored on our servers"). Notebook mode with "Download .ipynb", "Reset to the lesson's code", "Replay", "Show me / Line by line" step-through animation, "Read only" mode, per-lesson saved edits ("Your edits are saved, lesson by lesson") and "Download my project", "Sign in to start building the project", "Free with an account".
- **Callouts** ("Watch out.", "Worth remembering"), **Try it yourself** list, **Section quiz** page (5 Qs, score stored; interview-style "Say your answer out loud first, then reveal / Reveal the answer / 30-second answer"), share button, handwritten-notes PDF links on some courses.
- **Completion**: footer button completes the lesson (event `lesson_completed`), advances to the next lesson in the slice, or returns to the roadmap stop. Rail shows check marks, overall %, part counters.
- **Gamification** [V, from code]: XP = 20 per lesson + 5 per quiz point; level = floor(XP/300)+1 with names Curious builder, Steady learner, Practitioner, Shipping engineer, Systems architect; day-streak from `activedays`; roadmap XP weights lesson 20, topic 50, soon 100, project 300.
- **Theming**: dark (default) and light via `data-theme`, stored in `krishnaik.tutorial.theme`, respecting `prefers-color-scheme: light` on first visit; floating **accent colour picker** (grid of swatches, bottom-right, recomputes accent, accent-fill, wash, glow), saved as `krishnaik.tutorial.accent`.
- **Search**: no lesson search found in the lesson page JS [U; the hub may have one, not verified]. **AI assistant**: the roadmap page footer mentions "Progress, streaks, a study plan and Vidya AI, synced on every device" (login feature under `/learn-ai/...`, not accessible); none in the lesson page itself [V].

### Progress persistence [V]
Anonymous: **localStorage only**, keys `krishnaik.tutorial.progress.<course>` (array of done lesson ids), `.slugs.<course>`, `.quiz.<course>` ({part: {score,total}}), `.standalone` (done topic/project stops), `.activedays`, `.lastcourse`, `krishnaik.roadmap.<slug>` (array of manually completed stop ids), `krishnaik.roadmap.return.<slug>`, `krishnaik.lab.project.<id>` (editor files, regions, done, revealed, tries, xp, streak), `krishnaik.lab.keys`, `.lab.model`. A custom event `coding-labs-progress` plus `storage` and window `focus` listeners keep the roadmap page and the lesson tab in sync live. sessionStorage `krishnaik.tutorial.origin` remembers where you came from for the Back link. Signed-in sync is advertised but gated [U].

A stop on the roadmap is "done" automatically when all lessons in its slice are in `progress.<course>`; topic/project/soon stops use "Mark complete · +N XP" (manual toggle); the LiteLLM "soon" stop is skippable by marking it done by hand (per FAQ).

## 6. Roadmap page UX and visual design [V from JS/CSS; look and feel U, no screenshots]

- **Visualisation**: a **vertical quest map**, not a node graph. Each stage is a section with a banner (kicker, big number `banner-num`, stage name, tool logos `banner-tools`, progress, reward pill "Clear it to earn <rank>"). Under it, `path-wrap` holds an `<ol class="path">` of stops (`step`) that **zig-zag** horizontally using offsets `[0, 58, 112, 58]` px, joined by an SVG trail (`trail-base` dim, `trail-lit` bright for completed segments, drawn from measured node positions). Project "boss" stops (`k-boss`) are larger (84px vs 64px) and centred. States: `done` (check), `current` (up-next, start flag), `todo`, `is-soon` (locked). Gates between stages (`gate`, `gate-line`, `gate-label`). Tool logo inside each node.
- **Detail drawer** (`dz` dialog, right aside panel, `--c` = stage colour): kicker, title, summary, "Why", "What you learn", lessons list (`ls-row`: number, title, minutes, check), sources (tool logo + docs link), checkpoint question, primary button ("Read the topic" / "Open the project" / lessons) that links with `?id=..&roadmap=..&stop=..`, or "Mark complete · +N XP" toggle, and next-stop navigation. `?stop=<id>` on the roadmap scrolls to and flashes the node.
- **Quest dashboard** (`quest`): overall % ring (`pring`), "Your rank" (starts "Recruit", then stage ranks), `XP / total XP` bar, "Up next" card with Start/Continue button, "Path complete" finish card with the finish line text, link "Track it on your dashboard".
- **Below the map**: "What you learn here, and why each one" tool cards with pick/skip, FAQ accordion, "Other role roadmaps" cards, promo banner.
- **Animations**: keyframes `bob, btpop, fade, flash, pop, pulse, rise, slide`; 0.14-0.16s hover transitions (lift `translateY(-2px)`).
- **Palette (dark default)**: true-neutral greys, no blue cast: bg `#000`, panel `#0d0d0d`, panel-2 `#141414`, rail `#070707`, line `#262626`, text `#f5f5f5`, body `#d4d4d4`, muted `#a3a3a3`. Default accent neon green `#1aff94` (accent-fill `#038146` for filled buttons so white text clears 5:1). Diagram hues d1 `#38bdf8`, d2 `#a78bfa`, d3 `#22c55e`, d4 `#ffc861`, d5 `#f472b6`, plus gold, purple, warn `#ff5f56`; stages cycle through these so each has a hue. Code bg `#080808`; syntax keyword `#ff8a3d`, string `#7ee787`, number `#ffc861`, func `#79c0ff`, builtin `#d2a8ff`. Light theme uses darker greys for text and lines. Dot-grid background behind diagrams.
- **Typography**: Inter for everything (CSS comment: tallest x-height, keeps I/l/1 apart, headings same family heavier with tighter tracking), mono for kickers, labels (9.5px, uppercase, 0.14em tracking) and code (13.5px). Icons: inline SVG line icons (book, trophy, shield, tick, arrow); tool brand logos from CloudFront.
- **Responsive**: roadmap breakpoint 700px; lesson page 900px and 1180px.

## 7. What is NOT accessible / unverified

| Item | Why | How to get it |
|---|---|---|
| Rendered pixels (exact layout, spacing, animation feel, mobile view) | I had HTML/JSON/JS/CSS only, no browser | Chrome: open the roadmap URL, DevTools, Toggle device toolbar (Ctrl+Shift+M) for mobile, Ctrl+Shift+P then "Capture full size screenshot", in dark and light; click one stop to capture the drawer. |
| Section quiz questions and answers (`/ai-tutorials/langchain/quiz/<part>`) | Not fetched; probably in `__NEXT_DATA__` of those pages | `curl` one quiz URL and extract `__NEXT_DATA__` as in section 0, or open in Chrome. |
| Signed-in features: `/learn-ai/...` dashboard, synced progress, study plan, "Vidya AI", run-on-server cells (`POST /api/lab/run`, `/api/lab/warm`, Bearer token), saved project files | Login gated; `/api/` is disallowed in robots.txt and I did not call it | Sign in (free account) in Chrome, DevTools, Network, filter Fetch/XHR, use the feature, right-click request, Copy as cURL / Preview. Application tab, Local Storage, for real `krishnaik.*` JSON shapes. |
| Capstone project page and `topic:` / `project:` stop pages | Not fetched | Open from the roadmap drawer and `curl` it. |
| Hub search/filter behaviour; lesson search | Not verified | DevTools, Sources, search "search" in `/_next/static/chunks`; or try it. |
| Exact CSS (spacing, radius) | I extracted tokens, not the full CSS | `curl https://www.krishnaik.in/_next/static/css/687eb7466c56961f.css` and `.../17eca45cc2a1cc17.css` (page also uses styled-jsx inline); or Chrome Ctrl+S "Webpage, Complete". |

## 8. Ideas our tracker could adopt (ranked)

1. **URL-composed slices** (`?id=1-2,5-8,11&roadmap=<slug>&stop=<id>`): roadmap nodes reference a course plus a lesson-id set in compact range syntax, with parse and compress helpers (sorted, unique, capped range width). One lesson corpus serves many roadmaps and custom playlists; every link deep-links.
2. **Focus mode in the rail**: "Roadmap focus" box, `infocus` / `outfocus` dimming, toggle "Only these lessons" / "Show all lessons", breadcrumb "Roadmap · lesson N of M", prev/next that respect the slice.
3. **Return-to-stop**: finishing the last lesson in a slice navigates to `/roadmap/<slug>?stop=<id>`, which scrolls to and flashes the stop.
4. **Stop completion derived from lesson progress**; manual "Mark complete" only for topic, project and soon stops. Locked "soon" stops are skippable.
5. **Stage = kicker + rank + colour + checkpoint question + project** ("Clear it to earn <Rank>"), per-block `why / learn[] / checkpoint / uses[]`; capstone lists the stages it reuses.
6. **Vertical quest map**: zig-zag nodes joined by an SVG trail (dim base, lit completed segment), bigger "boss" node for projects, right-side detail drawer, quest card with % ring, rank, XP, "Up next -> Continue".
7. **Live cross-tab sync** via a custom event plus `storage` and `focus` listeners; our Turso store can replace localStorage but keep the event pattern.
8. **Design details**: true-neutral black theme, one accent plus 5 diagram hues (fill shade darker than text accent), Inter plus mono kickers, floating accent picker, remembered install-tab choice, copy buttons, "Last updated + pinned versions" per lesson, video clip with start/end, "pick this if / skip if" tool cards, cross-linked role roadmaps.

Caveat: their roadmap data is static JSON resolved server-side per request (`resolved[ref]`), and progress is browser-local unless signed in. Our single-user, JSON-roadmaps-plus-Turso design maps well: add an `id`-slice `ref` per node with a resolver.
