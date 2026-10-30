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