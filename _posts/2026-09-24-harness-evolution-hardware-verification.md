---
layout: post
title: "Automatic Harness Evolution for Hardware Design Verification: Can LLMs Consolidate Gains Across Discovered Harnesses?"
date: 2026-09-24 10:00:00
description: "We let LLMs evolve the harness around a coding agent for hardware verification. Coverage went way up; correctness improved less, and the gains were split across harnesses instead of consolidating into one."
tags: agents llm harness-engineering hardware-verification paper
categories: agents
thumbnail: assets/img/harness-evolution-overview.png
giscus_comments: false
related_posts: false
citation: true
---

_Joint work with Kidus Seyoum. The paper is on [arXiv](https://arxiv.org/abs/2609.28908)._

There's been a lot of talk lately about recursive self-improvement: AI systems that improve the systems they run on, with each round making the next one easier. In my [last post]({% post_url 2026-07-11-coding-agents-harnesses-where-things-are-going %}) I pointed to self-evolving harnesses as one place where this is already happening, with agents rewriting their own scaffolding for measurable gains. This project started as a way to see how that would play out in hardware. Hardware design verification (DV) is one of those domains models see far less of in training than software engineering, and the results are easy to check, so it's a good test of whether the loop keeps improving or stalls.

## Setup

We keep the subject model fixed and have stronger language models like Opus 5 and GPT-5.5 propose changes to the runtime harness and scaffold configuration, based on execution evidence. Candidates are screened with cheap trials, then confirmed with five-trial runs. Every candidate is materialized in its own directory, evaluated, and recorded in an archive.

The main benchmark is 12 proprietary DV root-cause localization tasks. The agent gets a read-only workspace and has to find where the bug is and recommend a change. The primary subject model is Kimi K3, with additional runs on DeepSeek V4 Pro and MiniMax M3.

{% include figure.liquid loading="eager" path="assets/img/harness-evolution-overview.png" class="img-fluid rounded z-depth-1" zoomable=true alt="System overview: a candidate harness (instructions, retrieval, runtime, finalization) wraps a fixed subject model working in a task workspace. Attempts are scored by a fixed evaluator, and an evolution loop aggregates outcomes, has an LLM optimizer propose harness edits, verifies and evaluates the candidates, and promotes or archives them." %}

<div class="caption">The setup. The subject model stays fixed while an outer loop proposes, evaluates, and keeps or archives harness candidates.</div>

## What we found

**Evolution helps a lot with finishing and a little with being right.** The evolved harnesses raised completed attempts by 71–76% (34/60 → 58–60/60) and any-hit task coverage by 80–100% (5/12 → 9–10/12). Total correct attempts rose only 18–24% (17/60 → 20–21/60). The mechanisms the proposer came up with, like bounded search, evidence-grounded queries, coverage ledgers, and causal commitment, mostly keep the agent from stalling or running out of turns.

**The gains don't consolidate.** The two best evolved harnesses solved 11/12 tasks between them, but neither one was strongest everywhere. One solved T3 but failed every T10 trial; the other recovered T10 and lost T3. A larger run produced 958 candidates, and the archive as a whole covered 10/12 tasks (the baseline passed 1/12), but only two candidates passed our strict promotion rule. We also saw validation gains fail to transfer: a DeepSeek harness went from 0.375 to 0.725 on a held-out validation set, then tied the baseline at 2/12 on full replays.

{% include figure.liquid path="assets/img/harness-evolution-task-matrix.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Heatmap of successful trials out of five for each of 12 design-verification tasks under the Kimi K3 baseline, the evidence-grounded harness, and the batched causal harness." %}

<div class="caption">Successful trials out of five per task. The totals improve, but each evolved harness wins on different tasks and some regress against the baseline.</div>

**It works for repair too.** In a case study on 142 CVDP tasks with GLM-5.2, an evolved repair harness reached 61/142 functional passes against a 45/142 baseline, 35.6% more. The final functional verifier ran only after the agent's output was complete, and its result was not fed back to the agent for that task.

## Takeaway

If evolution keeps producing specialists instead of one harness that wins everywhere, then picking a single "best" harness and throwing away the rest loses useful work. We argue the archive should be a first-class output: keep manifests, task-level scores, traces, and lineage; select or route among complementary harnesses; and report archive-union coverage separately from single-harness performance so it doesn't look like one harness is better than it is.

{% include figure.liquid path="assets/img/harness-evolution-archive-coverage.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Bar charts of tasks covered out of 12. In the large branching experiment: baseline 1, best archived individual 4, archive union 10. In the repeated Kimi K3 evaluation: evidence-grounded 9, batched causal 10, two-harness union 11." %}

<div class="caption">The archive covers far more tasks than any single harness. Union bars show portfolio coverage, not the score of one combined harness.</div>

This also matters for recursive self-improvement. The usual picture has each round building on the one before, so improvements stack up. In our setting, each round mostly found a different specialist instead. A self-improving loop may need a step that explicitly merges or routes between what earlier rounds found. Otherwise it keeps rediscovering partial wins instead of compounding them.

The usual caveats apply. Twelve tasks is a small benchmark, five trials per task still leaves noise, and each evolved harness bundles several changes, so we can't attribute gains to any single edit. The paper covers these in more detail.

Paper: [arXiv:2609.28908](https://arxiv.org/abs/2609.28908)
