# Layer 7 — Forward Deployed Engineering

Weeks 23–26. Work inside a client's world: discover and scope a problem, record decisions, connect to client systems, deploy securely, plan for compliance, show ROI, and hand the system over. Written for a senior full-stack engineer moving into applied AI.

Main sources: primary docs only (adr.github.io, Google SRE book, AWS SaaS Lens, OWASP, NIST, identity provider docs, Anthropic pricing). Role context: The Pragmatic Engineer and the Palantir Forward Deployed AI Engineer posting.

## Items

| ID | Title | Kind | Hours | Track |
|---|---|---|---|---|
| c701 | What are Forward Deployed Engineers, and why are they so in demand? | article | 1 | core |
| c702 | Project: write a discovery doc and success metrics for a real small business process | project | 4 | core |
| c703 | Architectural Decision Records and MADR templates | docs | 1 | core |
| c704 | Webhooks and REST integration (Stripe webhooks guide) | docs | 1.5 | optional |
| c705 | Okta: OAuth 2.0 and OpenID Connect overview | docs | 2 | core (pick one) |
| c706 | Auth0: OpenID Connect protocol | docs | 2 | core (pick one) |
| c707 | Microsoft Entra: OpenID Connect on the Microsoft identity platform | docs | 2 | core (pick one) |
| c708 | Authorization cheat sheet: least privilege and RBAC | docs | 1 | core |
| c709 | SaaS Lens: tenant isolation and silo, pool and bridge models | docs | 2 | optional |
| c710 | Logging cheat sheet: what an audit log must record | docs | 1.5 | core |
| c711 | Project: deploy the agent into a mock client environment with SSO, RBAC and audit logs | project | 8 | core |
| c712 | NIST SP 800-66 Rev. 2: implementing the HIPAA Security Rule | docs | 3 | optional |
| c713 | Token economics: pricing and prompt caching (Anthropic docs) | docs | 1.5 | core |
| c714 | Being on-call: runbooks, handover and escalation (Google SRE book) | docs | 1.5 | core |
| c715 | FDE case-interview drill: scope a vague client problem live | article | 1.5 | core |
| c716 | Project: run an end-to-end client engagement and hand it over | project | 20 | core |

Core about 43 h (counting the pick group once; the three projects are 32 h of that), optional about 6.5 h.

## Projects

- Beginner (c702): discovery doc and success metrics for a real small business process (about 4 h).
- Intermediate (c711): deploy the agent into a mock client environment with SSO, RBAC and audit logs (about 8 h).
- Advanced (c716, core capstone): end-to-end client engagement with discovery doc, one-week prototype, ROI readout, handover docs and runbook (about 20 h).

## Outcomes

- Turn a vague client request into a problem statement, success metrics and a measured baseline
- Write a SOW and ADRs that record scope, non-goals and key decisions
- Integrate with client systems through SQL, REST and webhooks, and read the pitfalls of each
- Deploy an agent into a client-style environment with SSO, RBAC, tenant isolation and audit logs
- Design with SOC 2 and HIPAA in mind, and know what data and residency questions to ask
- Compute cost per task and ROI, and present results to non-technical stakeholders
- Write a runbook and hand a system over to the client's team
- Scope a vague client problem live in a case interview
