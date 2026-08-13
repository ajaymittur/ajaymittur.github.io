---
layout: page
title: LLM Agents for Scientific Discovery
description: A benchmark for evaluating how well LLM agents generate novel research ideas, formulate rigorous experiment plans, and implement them in code.
img: assets/img/llmagent.svg
importance: 1
category: llm
selected: true
---

Large language models are increasingly used as research collaborators, but it is still difficult to tell whether an agent is genuinely reasoning through the scientific process or simply producing plausible-looking output. Existing agent benchmarks often emphasize task completion, tool use, or final artifacts while giving less attention to the reasoning that connects literature, hypotheses, experiments, and evidence.

This project develops a benchmark for evaluating scientific agents across three connected capabilities: identifying promising research directions, translating ideas into rigorous experiment plans, and implementing those plans as executable code. The initial benchmark focuses on natural language processing research, where recent papers and their references provide a controlled setting for testing novelty beyond likely model training data.

## Benchmark framework

### 1. Research idea generation

The first component asks whether an agent can identify a meaningful research gap and propose an idea that goes beyond familiar prior work.

- Recent NLP papers published after likely model training cutoffs serve as target discoveries.
- Reference abstracts provide the agent with the state of the field available before each target paper.
- The agent generates a hypothesis and then aligns it with multiple-choice options representing the target idea, prior work, or plausible but technically flawed alternatives.
- A similarity threshold lets the agent abstain when none of the options adequately matches its proposal.

This design keeps idea generation open-ended while providing a grounded way to measure whether the generated idea approaches a genuinely new research direction rather than recalling an established one.

### 2. Research plan formulation

The second component evaluates whether an agent can turn a research idea into a coherent and executable experiment plan. Plans are scored by an LLM jury using a seven-part rubric:

1. Research-question clarity
2. Methodological soundness
3. Data selection and treatment
4. Evaluation metrics
5. Technical implementation
6. Reproducibility
7. Limitations and risks

Plans can be extracted directly from an agent's logs or reconstructed from its trajectory when the agent does not expose a dedicated planning stage. The benchmark also accounts for systematic differences between judge models instead of assuming that all LLM evaluators use the scoring scale in the same way.

### 3. Experimental implementation

The final component studies whether an agent can produce functional code that implements its proposed experiment. Ground-truth implementations associated with the target papers provide a reference, while execution success and functional equivalence are more meaningful signals than surface-level code similarity alone. This portion of the benchmark remains an active area of development.

## Validating the plan evaluator

To test whether the research-plan rubric detects meaningful differences in quality, plans from 25 filtered papers were evaluated in four forms: plans extracted from the papers, zero-shot plans proposed from the research idea, subtly degraded plans, and severely degraded plans.

| Plan type              | Average score (1–5) |
| ---------------------- | ------------------: |
| Extracted plan         |                3.88 |
| Zero-shot proposal     |                3.24 |
| Subtly degraded plan   |                2.26 |
| Severely degraded plan |                1.00 |

The ordering follows the intended quality levels, showing that the rubric can distinguish sound plans from plans with increasingly serious flaws. In a second stress test, successive changes designed to derail otherwise valid plans generally reduced their scores through the first three perturbations; after that point, the scores became less predictable as flaws began to interact or overlap.

## Judge behavior matters

Comparisons among GPT-4o, Llama 3.1 8B Instruct, and Qwen 2.5 7B Instruct showed that judge choice significantly affects reported scores. GPT-4o's scoring distribution differed significantly from both smaller judges, while the difference between Llama and Qwen was not statistically significant at the 0.05 level.

A broader jury using GPT-4o, Claude 3.7 Sonnet, and DeepSeek Reasoner also revealed different evaluation priorities. Claude was stricter about explicit framing, reproducibility, and ethical safeguards; GPT-4o rewarded technical depth; and DeepSeek tended to provide more concise, holistic critiques. These differences motivate calibrated multi-judge evaluation rather than relying on a single unadjusted score.

## Initial findings

Early evaluation of plans extracted from scientific-agent runs found that AI Scientist plans averaged **3.0 out of 5**, corresponding to an adequate plan with notable room for improvement. The plans generally stated clear research questions and proposed logical experimental steps, but often omitted details important for rigorous science:

- dataset preparation, splits, and bias considerations;
- concrete evaluation metrics and statistical testing;
- hyperparameters and resource-feasibility details;
- reproducibility practices; and
- explicit limitations, risks, ethics, and contingency plans.

The idea-generation study also exposed a tension between coverage and confidence. Requiring a minimum similarity score reduced the rate at which the model selected familiar prior work, but it also reduced overall accuracy. This suggests that abstention can discourage weak associations while placing greater pressure on the quality and calibration of the similarity evaluator.

## Limitations and next steps

The benchmark is an initial framework rather than a complete measure of scientific ability. Multiple-choice alignment is only an indirect measure of open-ended novelty, LLM juries still require validation against expert human judgments, and evaluating scientific code demands stronger criteria than textual similarity.

The next steps are to calibrate judges across scoring distributions, compare jury decisions with expert evaluations, develop execution-based code assessment, evaluate more scientific agents, and extend the benchmark beyond NLP.
