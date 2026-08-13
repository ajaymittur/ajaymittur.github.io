---
layout: page
title: English to French Machine Translation
description: Compared neural machine translation architectures and adapted Llama 2 7B for English-to-French translation using quantization and QLoRA.
img: assets/img/project_diagrams/translation.svg
redirect:
importance: 3
category: llm
---

In this project, I explored how established neural machine translation architectures and a general-purpose LLM could be adapted for English-to-French translation under limited compute.

## Project scope

I compared four approaches:

- a bidirectional RNN encoder-decoder with soft attention;
- a convolutional sequence-to-sequence model;
- a Transformer trained for neural machine translation; and
- Llama 2 7B adapted as an instruction-following translator.

For the Llama approach, I used `llama.cpp` to quantize Llama 2 7B to 8-bit precision and run it locally on a base MacBook Air. I tested the base and chat variants with different translation prompts before selecting Llama 2 7B Chat for supervised fine-tuning.

## Efficient fine-tuning

The source dataset contained 22.5 million English-French sentence pairs. I converted the pairs into instruction prompts, created a 90/10 train-test split, and sampled the data for the compute-constrained experiments.

I fine-tuned a 4-bit QLoRA adapter with Hugging Face PEFT and TRL on two NVIDIA T4 GPUs. The final run used 1,000 sentence pairs over nine epochs and took approximately 12 hours. I also experimented with beam search, sampling strategies, learning-rate scheduling, sequence length, and manual memory management during evaluation.

## Results

| Model                    | BLEU score |
| ------------------------ | ---------: |
| Bidirectional RNN        |      23.86 |
| Convolutional Seq2Seq    |      36.21 |
| Llama 2 7B before tuning |       5.00 |
| Llama 2 7B after QLoRA   |       6.00 |

The Llama improvement was modest, but the project demonstrated that a 7B model could be quantized, run on consumer hardware, and adapted for translation with a small parameter-efficient training run. The work highlighted the tradeoffs among model quality, GPU memory, training time, and generation settings.
