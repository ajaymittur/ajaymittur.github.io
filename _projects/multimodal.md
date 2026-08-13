---
layout: page
title: Improving Multi-modal Interactions in Memes
description: Studied how vision-language models understand memes, using retrieval-augmented generation and abductive-reasoning fine-tuning to improve multimodal reasoning.
img: assets/img/project_diagrams/multimodal.svg
importance: 3
category: llm
---

Memes are a difficult multimodal reasoning problem because their meaning rarely exists in the image or text alone. The two modalities interact through cultural references, visual metaphors, contrast, and implied context. In this project, I studied how current vision-language models handle these interactions and explored two ways to improve them: external knowledge retrieval and fine-tuning for visual reasoning.

## Tasks and models

I evaluated models on meme caption generation and hateful-meme classification using MemeCap, Hateful Memes, and Memotion. The experiments covered unimodal and multimodal systems including Llama, BERT, ResNet, VisualBERT, MMBT, M4, CLIP + GPT-2, ViT + GPT-2, and InstructBLIP.

Alongside downstream metrics such as accuracy, AUROC, ROUGE, BERTScore, and CLIPScore, I used intrinsic measurements to inspect whether the models were actually learning useful image-text interactions. These included image-text matching, contrastive similarity, cross-modal retrieval, and EMAP analysis.

## Adding external knowledge with RAG

Many memes depend on facts about people, television characters, events, or cultural references that are not visible in the image. I built a RAG pipeline around InstructBLIP to supply that context:

1. Curate a textual knowledge base from television captions and annotated meme explanations.
2. Encode the knowledge with CLIP's text encoder.
3. Encode the input meme with CLIP's image encoder.
4. Retrieve the most similar descriptions and add them to the InstructBLIP prompt.

This approach required no additional training and could be attached to an existing generative vision-language model.

## Fine-tuning for visual reasoning

I also fine-tuned InstructBLIP's Q-former on SHERLOCK, a visual abductive-reasoning dataset. The goal was to teach the fusion module to infer situations from visual clues instead of producing only literal image descriptions. All other model components were frozen during this experiment.

## Results

On MemeCap caption generation, InstructBLIP with five retrieved knowledge snippets produced the strongest overall result:

| Model                    | BERTScore-F1 | ROUGE-L | CLIPScore |
| ------------------------ | -----------: | ------: | --------: |
| InstructBLIP             |         0.87 |    0.15 |      0.77 |
| InstructBLIP + RAG (k=3) |         0.87 |    0.26 |      0.77 |
| InstructBLIP + RAG (k=5) |         0.88 |    0.32 |      0.79 |

The same RAG setup did not improve hateful-meme classification: irrelevant retrieved captions sometimes distracted the model and changed a correct prediction into an incorrect one. Fine-tuning for abductive reasoning improved some representation metrics but reduced downstream performance because the model learned to emphasize visual inference without adequately incorporating the meme's text.

The central lesson was that stronger fusion matters. Q-former-based models captured image-text alignment better than simple linear projection or gating approaches, but external knowledge only helped when retrieval returned context that was both relevant and trustworthy.
