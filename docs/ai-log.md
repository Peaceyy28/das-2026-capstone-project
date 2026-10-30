
# AI Interaction Log

This document tracks prompts given to the AI coding partner, the code generated, critical reviews of the responses, and adjustments made during development.

---

## Build 1: Domain Core in the Terminal

### Entry 1.1: Building the Domain Core Step-by-Step

- **Date:** 2026-10-30
- **Prompt:**
  > "Set up Build 1 on branch `build-1`. Guide me through building the domain core step-by-step: the FIFO waitlist queue with a linked list, capacity checking, ticket booking, cancellations, and the Map lookup benchmark."

- **What Came Back:**
  - Initial proposal generated all files at once.
  - Provided implementations of `WaitlistQueue` (`src/waitlist-queue.js`), `TicketingSystem` (`src/ticketing-system.js`), `demo.js`, and `benchmark.js`.

- **What was wrong / What was adjusted:**
  - *Engineering Pace & Learning:* The initial AI output generated the entire codebase in one large drop. I asked to reset and pace the work step-by-step so I could understand each data structure (`head`/`tail` pointers, `enqueue`/`dequeue`) and wrote a scratch test (`test-queue.js`) to verify FIFO ordering before integrating it.
  - *Validation & Course Constraints:* Enforced that ticket quantities are strictly constrained between 1 and 10 (`VALIDATION_ERROR`), and verified prices are stored strictly as whole numbers of the smallest currency unit (cents/kobo) rather than floating decimals.

# AI log

Every time you give an AI tool a significant prompt, add an entry. Three lines each.
"Nothing was wrong" is allowed, but it is rarely true. Your instructor will read this.

## Build 2

### Prompt 1: Build 2 prompt (docs/build-2.md)
- **What I asked:**
- **What came back:**
- **What was wrong (or "nothing"):**

### Prompt 2:
- **What I asked:**
- **What came back:**
- **What was wrong (or "nothing"):**

## Build 3

### Prompt 1: Build 3 prompt (docs/build-3.md)
- **What I asked:** Add the architecture diagrams, booking state machine, Node HTTP router/server, configuration, startup script, and tests.
- **What came back:** A layered architecture document, explicit booking transitions, static-file HTTP server, `/health` route, startup configuration, and `node:test` coverage.
- **What was wrong (or "nothing"):** The first server draft relied on an implicit response/request property for HEAD handling and had redundant error-status logic; both were simplified. Added a regression test proving static requests cannot escape `public/`.

