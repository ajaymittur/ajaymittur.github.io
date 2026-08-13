---
layout: page
title: Real-world Movie Recommendation System
description: A production-style movie recommendation service for 1M+ simulated users, with online evaluation, A/B testing, monitoring, and scalable deployment infrastructure.
img: assets/img/project_diagrams/movie.svg
redirect:
importance: 3
category: ml
---

I helped develop a production-style movie recommendation service for a simulated environment with more than one million users. The scope extended beyond model training to the data, serving, deployment, experimentation, and monitoring systems required to operate a recommender as a real service.

The system placed in the top three in the class for the average user rating of recommended movies.

## Recommendation models

We compared two complementary approaches:

- **SVD collaborative filtering**, which learned compact user and movie embeddings with low training cost and no manual feature engineering.
- **XGBoost**, which used user demographics and movie metadata while providing fast inference and a small memory footprint.

Offline and online evaluations reported accuracy above 90%. We measured online behavior through click-through rate and mean reciprocal rank rather than relying only on offline prediction metrics.

## Production system

The service combined:

- Kafka streams for user, movie, rating, and interaction data;
- Flask APIs for model inference;
- Dockerized services with load balancing and autoscaling;
- A/B testing between recommendation models;
- Prometheus for metrics collection; and
- Grafana dashboards for model and system health.

The deployed services reached approximately 95–99% uptime. We addressed early reliability and latency problems through model changes, caching, error handling, and server refactoring.

## Monitoring and feedback loops

We monitored both operational and ML behavior: service availability, inference performance, online engagement, data drift, user-group representation, and recommendation quality.

One important finding was a popularity feedback loop. A small set of movies dominated recommendations, which concentrated subsequent ratings on the same titles and further reinforced their popularity. We explored hybrid recommendations, explicit diversity controls, and better handling of new movies as potential mitigations.

The project covered the less visible parts of production ML: reliable data storage, testing and CI/CD, observability, fairness analysis, model rollout, and the architectural changes required when a prototype begins to face real scaling constraints.
