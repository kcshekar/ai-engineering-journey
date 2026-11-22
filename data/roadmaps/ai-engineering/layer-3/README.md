# Layer 3 — Agents & Orchestration
**Weeks:** 7–10 · **Items:** 15 · **Core hours:** 45 · **Optional hours:** 2.5

Tool calling, the agent loop, memory, MCP servers and multi-agent patterns, turning LLM calls into systems that act.

## What this layer covers
- Function calling and tool use, the agent loop (ReAct), memory and human-in-the-loop
- MCP: host, client and server, and building your own server (core, the centrepiece)
- Agent SDK: pick one of Claude Agent SDK, OpenAI Agents SDK, LangGraph or CrewAI
- Multi-agent patterns, and (optional) computer-use and browser agents
- Main source: AI Engineering from Scratch phases 13 and 14 (MIT), plus official docs

## Items
| ID | Title | Kind | Hours | Track |
|----|-------|------|-------|-------|
| c301 | Function Calling Deep Dive (tool-use loop) | repo | 2 | core |
| c302 | The Agent Loop and ReAct | repo | 2.5 | core |
| c303 | Building Effective Agents (Anthropic) | article | 1 | optional |
| c304 | Agent Memory: Context Windows and Virtual Memory | repo | 2 | core |
| c305 | Introduction to Model Context Protocol | course | 2 | core |
| c306 | MCP Fundamentals and Building a Server | repo | 2 | core |
| c307 | Claude Agent SDK (pick one) | docs | 3 | core |
| c308 | OpenAI Agents SDK (pick one) | docs | 3 | core |
| c309 | LangGraph (pick one) | docs | 3 | core |
| c310 | CrewAI (pick one) | docs | 3 | core |
| c311 | Multi-Agent Patterns: Supervisor and Orchestrator | repo | 2.5 | core |
| c312 | Computer-Use and Browser Agents | repo | 1.5 | optional |
| c313 | Project: DM Triage Agent With Mocked Tools | project | 4 | core |
| c314 | Project: MCP Server for NuraKnect Data and Tools | project | 8 | core |
| c315 | Project: Multi-Agent Workflow With Human Approval and Eval | project | 8 | core |

Start with: If you already call LLM APIs with tools, skim c301 and c302, then start MCP at c305 and pick one Agent SDK.

## Projects
- Beginner (c313): a tool-calling DM triage agent with mocked tools
- Intermediate (c314): an MCP server exposing NuraKnect data and tools
- Advanced (c315): a multi-agent workflow with a human approval step and a task-success eval

## Outcomes
- Build a tool-calling agent loop with schemas, error results and a step limit
- Explain host, client and server in MCP and expose your own data and tools through a server
- Choose an Agent SDK for a product and justify the choice against the other three
- Design agent memory with a window, summaries or retrieval and know the trade-offs
- Add a human approval step before an irreversible agent action
- Evaluate a multi-agent workflow by task success, not just by whether it ran
