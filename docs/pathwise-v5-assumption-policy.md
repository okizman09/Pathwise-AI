# Pathwise AI V5 — Assumption & Inference Policy

## 1. Hierarchy of Truth

Pathwise AI strictly distinguishes between 5 levels of certainty:

| Tier | Name | Definition | Impact on Architecture |
|---|---|---|---|
| 1 | **Explicit Evidence** | Directly stated by user in prompt or clarified via questions. | Drives mandatory tasks and tools. |
| 2 | **Strong Inference** | Contextually undeniable (e.g. hair brand $\rightarrow$ product showcase). | Drives core pipeline tasks. |
| 3 | **Weak Inference** | Plausible but unconfirmed (e.g. optional blog for a school). | May be offered as optional enhancement; NEVER mandatory. |
| 4 | **Unknown** | No evidence provided (e.g. user auth on a portfolio). | Strictly omitted and added to scope protection exclusions. |
| 5 | **Assumption** | Explicitly labeled, visible, and reversible design assumptions. | User can toggle or override at any time via UI. |

---

## 2. Strict Rules on Invented Data

1. **Target Audience Rule:** `targetAudience` is `null` unless explicit or strongly inferred by entity type (e.g. developer portfolio $\rightarrow$ recruiters/clients; restaurant $\rightarrow$ diners).
2. **Contact Channel Rule:** WhatsApp click-to-chat is ONLY injected if explicitly requested (`/\bwhatsapp\b/i.test(g)`). Otherwise, standard contact inquiry is used.
3. **No Database / Auth Hallucination:** Relational databases, Supabase, JWT auth, and admin dashboards are never added to simple showcase or portfolio websites.
4. **Prompt Variable Guardrail:** Prompt templates only receive resolved, evidence-backed values. Unsupported fields fallback to generic neutral strings rather than fake data.
