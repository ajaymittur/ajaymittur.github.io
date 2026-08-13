---
layout: page
title: Generalizable Agents with Llama 2
description: Adapted Llama 2 7B into a general-purpose agent using interaction-trajectory instruction tuning and Tree-of-Thought experiments across AgentBench environments.
img: assets/img/project_diagrams/agent.svg
importance: 3
category: llm
---

In this project, I developed and evaluated a general-purpose Llama 2 agent capable of reasoning and acting across several interactive digital environments. The central question was whether a relatively small open model could acquire useful agent behavior through instruction tuning without depending on a much larger proprietary model.

## Agent environments

I used AgentBench tasks that require a model to take actions, observe the environment, and continue reasoning until it reaches an answer or completes an objective. The environments included:

- relational databases;
- operating-system command execution;
- knowledge-graph querying;
- ALFWorld household tasks; and
- a strategic digital card game.

Each environment exposed different failure modes, including invalid actions, incorrect output formats, context-length limits, and trajectories that exceeded the maximum number of steps.

## Instruction tuning

I formatted GPT-4-generated AgentInstruct trajectories as ReAct-style conversations containing alternating thought, action, and environment-observation steps. I combined these agent trajectories with general conversational data so the model could learn task interaction without completely losing its broader language abilities.

I fine-tuned Llama 2 7B Chat with LoRA on AWS SageMaker. After quantized experiments across several adapter configurations, I selected a LoRA rank of 16 for a 13-epoch full-precision run. The final training job took approximately 26 hours.

## Tree-of-Thought experiments

I also implemented a greedy Tree-of-Thought agent with a branching factor of three. At each step, the model proposed several candidate actions, critiqued them, and selected the highest-scoring action while retaining the full interaction history.

This worked poorly for the 7B model. It often struggled to evaluate its own reasoning, follow strict action formats, and manage several candidate paths at once. The result was a useful negative finding: reasoning scaffolds that help large models do not automatically transfer to smaller models.

## Results

| Environment      | Base Llama 2 7B | Instruction-tuned 7B |
| ---------------- | --------------: | -------------------: |
| Database         |           0.023 |                 0.27 |
| Operating system |           0.014 |                 0.11 |
| Card game        |           0.000 |                0.003 |

Instruction tuning produced the clearest gains on database and operating-system tasks and substantially reduced invalid actions. The tuned 7B model also outperformed the untuned 70B baseline on the environments where both were evaluated, although ALFWorld and knowledge-graph tasks remained unsolved.

The results indicate that high-quality interaction trajectories can teach a small model meaningful agent behavior, but planning methods must be matched to the reasoning capacity of the underlying model.
