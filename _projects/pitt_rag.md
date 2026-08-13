---
layout: page
title: RAG Question Answering System on Pittsburgh
description: Built an end-to-end RAG system for factual questions about Pittsburgh and CMU, comparing baseline retrieval, reranking, and multi-query retrieval.
img: assets/img/project_diagrams/rag.svg
redirect:
importance: 3
category: llm
---

I built an end-to-end retrieval-augmented generation system for answering factual questions about Pittsburgh and Carnegie Mellon University. The project covered the complete RAG pipeline: collecting source material, cleaning and chunking documents, building a vector store, experimenting with retrieval strategies, generating answers, and evaluating the final system.

## Knowledge base

The knowledge base combined material from Wikipedia, official Pittsburgh and CMU websites, event calendars, cultural and sports sources, city tax documents, and operating-budget PDFs.

Because the sources had very different formats, I used a mixture of Beautiful Soup, Selenium, LangChain loaders, `pypdf`, and Unstructured for extraction. After cleaning and chunking the content, the vector store contained approximately **30,000 documents** with source metadata.

I also helped create a manually annotated test set of **115 questions** covering history, events, music, culture, food, sports, city data, and CMU. A second annotation pass on a subset produced a Cohen's kappa of 0.62, indicating moderate-to-high agreement.

## Retrieval approaches

I compared four systems:

- a closed-book language model with no retrieved context;
- a simple RAG baseline retrieving the six closest chunks;
- a contextual-compression pipeline using a BGE cross-encoder to rerank the results; and
- multi-query retrieval, which generated three alternative versions of each question and merged their retrieved documents.

The final pipeline used Stella embeddings with Chroma, Mistral Large to generate alternate search queries, and Command R+ to answer from the retrieved context.

## Results

| Method                | Exact match | Precision | Recall |    F1 |
| --------------------- | ----------: | --------: | -----: | ----: |
| No RAG                |       15.65 |     24.03 |  22.33 | 21.85 |
| Simple RAG            |       41.73 |     56.13 |  53.63 | 52.68 |
| Multi-query retrieval |       45.21 |     58.57 |  54.81 | 54.25 |
| Reranking             |       41.74 |     56.45 |  52.92 | 52.11 |

All three retrieval systems substantially outperformed the closed-book baseline. Multi-query retrieval achieved the best overall scores and handled a wide variety of question types, including detailed facts buried in PDFs. Reranking was also effective for numerical document questions, although it sometimes over-focused on a related but incorrect piece of context.

The project showed that retrieval strategy matters most when the answer is recent, local, or hidden in a specialized source. It also reinforced that RAG quality depends as much on data collection, chunking, metadata, and evaluation as it does on the generation model.
