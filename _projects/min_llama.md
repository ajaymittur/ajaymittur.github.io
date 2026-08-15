---
layout: page
title: Mini Llama 2 Implementation
description: Implemented the core architecture, generation loop, optimizer, and classification pipeline for a compact 42M-parameter Llama 2 model.
img: assets/img/llama2.jpg
importance: 3
category: llm
---

I implemented the core of a compact **Llama 2** model in PyTorch: normalization, rotary positional embeddings, self-attention, transformer blocks, autoregressive decoding, downstream classification, and the AdamW optimizer. The finished system could generate text from a pretrained checkpoint and be fine-tuned for sentiment classification.

## What I implemented

- RMS normalization for stable pre-normalized transformer blocks;
- rotary positional embeddings (RoPE) applied directly to query and key vectors;
- multi-head scaled dot-product attention within Llama's grouped-query attention structure;
- residual attention and SwiGLU feed-forward layers;
- greedy decoding and temperature-based token sampling;
- zero-shot prompting and a trainable sequence-classification head;
- AdamW with moving averages, bias correction, and decoupled weight decay; and
- Apple Metal Performance Shaders support for local GPU execution.

## RMS normalization

Llama uses RMSNorm instead of LayerNorm. I computed the root mean square across each token's hidden dimension, normalized the activations, and then applied a learned per-dimension scale. The calculation is performed in `float32` for numerical stability before converting back to the input type.

```python
class RMSNorm(torch.nn.Module):
    def _norm(self, x):
        mean = torch.mean(x**2, dim=-1, keepdim=True)
        rms = torch.sqrt(mean + self.eps)
        return x / rms

    def forward(self, x):
        output = self._norm(x.float()).type_as(x)
        return output * self.weight
```

## Rotary positional embeddings

Rather than adding a separate positional vector to each token, RoPE rotates pairs of query and key dimensions by a position-dependent angle. I split each vector into real and imaginary components, constructed the sine and cosine frequencies, applied the rotation, and interleaved the components back into the original shape.

```python
query_real, query_imag = query.float().reshape(
    query.shape[:-1] + (-1, 2)
).unbind(-1)
key_real, key_imag = key.float().reshape(
    key.shape[:-1] + (-1, 2)
).unbind(-1)

positions = torch.arange(seqlen, device=device).reshape(1, -1, 1, 1)
frequencies = theta ** (
    -2 * torch.arange(head_dim // 2, device=device) / head_dim
)
angles = positions * frequencies.reshape(1, 1, 1, -1)

cosine, sine = torch.cos(angles), torch.sin(angles)
rotated_query = torch.stack(
    (
        query_real * cosine - query_imag * sine,
        query_imag * cosine + query_real * sine,
    ),
    dim=-1,
).flatten(-2)
```

The same rotation is applied to the key tensor. Because the relative angle between positions is preserved, attention can use positional information without learned absolute-position embeddings.

## Self-attention and transformer blocks

I implemented scaled dot-product attention for every batch and attention head simultaneously using `einsum`. Scaling by the square root of the head dimension keeps the dot products from becoming too large before the softmax.

```python
def compute_query_key_value_scores(self, query, key, value):
    scores = torch.einsum("bhsd,bhSd->bhsS", query, key)
    scores = scores / math.sqrt(self.head_dim)

    weights = F.softmax(scores, dim=-1)
    weights = self.attn_dropout(weights)

    return torch.einsum("bhsS,bhSd->bhsd", weights, value)
```

The surrounding attention module projects the hidden states into query, key, and value tensors, applies RoPE, repeats shared key/value heads for grouped-query attention, combines the heads, and projects the result back into the residual stream.

Each decoder layer uses pre-normalization and two residual connections: one around attention and another around the SwiGLU feed-forward network.

```python
def forward(self, x):
    attention_output = self.attention(self.attention_norm(x))
    hidden = x + attention_output

    feed_forward_output = self.feed_forward(self.ffn_norm(hidden))
    return hidden + feed_forward_output
```

Stacking eight of these layers produced contextual token representations, which were passed through a final RMSNorm and vocabulary projection for next-token prediction.

## Autoregressive generation

For generation, I repeatedly cropped the sequence to the model's context length, ran a forward pass, selected a token from the final-position logits, and appended it to the sequence. A temperature of zero performs deterministic greedy decoding; higher temperatures flatten the distribution and introduce more variation.

```python
for _ in range(max_new_tokens):
    context = idx[:, -self.params.max_seq_len :]
    logits, _ = self(context)
    logits = logits[:, -1, :]

    if temperature == 0.0:
        next_token = torch.argmax(logits, dim=-1, keepdim=True)
    else:
        probabilities = F.softmax(logits / temperature, dim=-1)
        next_token = torch.multinomial(probabilities, num_samples=1)

    idx = torch.cat((idx, next_token), dim=1)
```

The checkpoint generated grammatical, story-like continuations. Its tendency to turn a movie-review prompt into a children's narrative also made the effect of the TinyStories pretraining distribution easy to see.

## Fine-tuning for classification

I added a classification head that uses the final token's contextual representation as a summary of the input. During fine-tuning, gradients flow through both this head and the complete Llama backbone.

```python
def forward(self, input_ids):
    _, hidden_states = self.llama(input_ids)
    final_token = hidden_states[:, -1, :]

    logits = self.classifier_head(self.dropout(final_token))
    return F.log_softmax(logits, dim=-1)
```

I evaluated the model on five-class Stanford Sentiment Treebank (SST-5) and binary CFIMDB movie reviews. Fine-tuning produced a large improvement over scoring label words through zero-shot prompting.

| Dataset | Zero-shot prompting | Fine-tuned classifier |
| ------- | ------------------: | --------------------: |
| SST-5   |               21.3% |                 41.0% |
| CFIMDB  |               50.2% |                 85.7% |

These are development-set accuracies calculated from my saved predictions. On the labeled SST-5 test set, the fine-tuned model achieved **39.3% accuracy**.

## AdamW optimizer

I also implemented the optimizer used for fine-tuning instead of relying on PyTorch's built-in AdamW. The update tracks exponential moving averages of the gradient and squared gradient, corrects their initialization bias, applies the parameter update, and then applies weight decay.

```python
state["m"] = beta1 * state.get("m", torch.zeros_like(param)) + (1 - beta1) * grad
state["v"] = beta2 * state.get("v", torch.zeros_like(param)) + (1 - beta2) * grad**2
state["step"] = state.get("step", 0) + 1

step_size = learning_rate * math.sqrt(1 - beta2 ** state["step"])
step_size /= 1 - beta1 ** state["step"]

param.data -= step_size * state["m"] / (state["v"].sqrt() + epsilon)
param.data -= step_size * weight_decay * param.data
```

Unit tests checked the RoPE and AdamW implementations, while an end-to-end sanity check compared the model's forward-pass embeddings with reference values. Together, these tests helped isolate low-level numerical errors before I moved on to generation and fine-tuning.
