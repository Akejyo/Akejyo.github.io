---
title: What is KVCache
date: 2026-3-15
categories: [Study, LLM]
tags: [LLM, KVCache]
math: true
---

# What is KV Cache

> 问各路 ai 半天也没怎么特别搞清楚，最后总算找到一个讲的不错的 🤪。
>
> 别问我怎么 KV Cache 都看不懂，问就是我很想知道具体细节操作是怎么个事，但是好多讲解都只讲个概念列列公式，很烦 😡。刚好这个教程里还附了 GPT2 的代码链接，可以过去瞅瞅怎么个事。
>
> 参考文章：[看图学 KV Cache - 知乎](https://zhuanlan.zhihu.com/p/662498827)

KV Cache 和注意力机制有关，首先介绍注意力机制.

对于一个输入 $X$，将其映射成查询、键、值：

- $Q=XW_Q$
- $K=XW_K$
- $V=XW_V$

注意力输出：

$$
Attention(Q,K,V)=softmax(\frac{QK^T}{\sqrt{d_k}})V
$$

其中 $d_k$ 是键向量的维度，用来缩放以稳定梯度.

**举例：**

假设我们在生成一个句子，第一步只有 `<sos>` 起始符，对应嵌入向量 $x_1=[1,0]$

- $d=2$, $\sqrt{d_k}=\sqrt{2}$
- 词表：”玛“: $[1,0]$、”恩“: $[0,1]$、”纳“: $[0.5,0.5]$
- 假设 $I=W_Q=W_K=W_V$，也就是说：
  - $q_i=k_i=v_i=x_i$

注意力分数：$e_{11}=\frac{q_1\cdot k_1}{\sqrt{2}}\approx 0.707$

Softmax: $\alpha_{11}=1$

输出：$z_1=\alpha_{11}v_1=x_1=[1,0]$

预测下一个 token:

- 使用 $z_1$ 计算 logits:
  - "玛": $[1,0]\cdot [1,0]=1$
  - "恩": $[1,0]\cdot [0,1] =0$
  - “纳”: $[1,0]\cdot [0.5,0.5]=0.5$
- Softmax 得到概率:
  - "玛": $0.506$
  - "恩": $0.186$
  - “纳”: $0.307$
- 生成 token "玛"，其嵌入向量 $x_2=[0,1]$

第二步计算注意力，此时有：

$$
\begin{aligned}Attention_{step2}(Q,K,V)&=softmax(\begin{bmatrix}Q_1K_1^T & -\infty \\ Q_2K_1^T & Q_2K_2^T\end{bmatrix})\begin{bmatrix}\overrightarrow{V_1}\\ \overrightarrow{V_2}\end{bmatrix} \\&= \begin{bmatrix}softmax(Q_1K_1^T)\overrightarrow V_2\\ softmax(Q_2K_1^T)\overrightarrow V_1+softmax(Q_2K_2^T)\overrightarrow V_2\end{bmatrix}\\&=\begin{bmatrix}Attention_1\\ Attention_2\end{bmatrix}\end{aligned}
$$

上式我们用的是多层 attention，计算第二步时把 $Attention_1$ 也塞进来了，此时需要注意 $mask$ 让这一步里的 $Attention_1$ 的计算看不见后续的 token，因为它本来就是看不见下文的. 也就是说这里的 $Attention_1$ 其实就是前面计算过的玩意.

注意到 $Attention_2$ 的计算里，$K_1$ 和 $K_2$，$\overrightarrow{V_1}$ 和 $\overrightarrow {V_2}$ 都又被用了一次，第 $k$ 步的计算只需要利用 $Q_k$ 根据之前的 $K_1...K_{k-1}$ 和 $\overrightarrow{V_1}...\overrightarrow{V_{k-1}}$ 来计算即可，所以这些 $KV$ 都要缓存起来继续用.

现在来看看 [GPT2](https://github.com/huggingface/transformers/blob/main/src/transformers/models/gpt2/modeling_gpt2.py) 的代码，在 `class GPT2Attention(nn.Module):` 这里，可以看一下 KV Cache

最需要关注的是这些：

```python
if past_key_values is not None:
    if isinstance(past_key_values, EncoderDecoderCache):
        is_updated = past_key_values.is_updated.get(self.layer_idx)
        #......
        #......
        curr_past_key_values = past_key_values.self_attention_cache
    else:
        curr_past_key_values = past_key_values
#......
#......
query_states, key_states, value_states = self.c_attn(hidden_states).split(self.split_size, dim=2)
shape_kv = (*key_states.shape[:-1], -1, self.head_dim)
key_states = key_states.view(shape_kv).transpose(1, 2)
value_states = value_states.view(shape_kv).transpose(1, 2)
#......
#......
if (past_key_values is not None and not is_cross_attention) or (
    past_key_values is not None and is_cross_attention and not is_updated
):
    key_states, value_states = curr_past_key_values.update(key_states, value_states, self.layer_idx)
```

会发现它尝试直接拿从 cache 里直接获取 past_KV，然后拿现在的 KV 去拼接 past_KY，这个 `update()` 可以在 [cache_utils.py](https://github.com/huggingface/transformers/blob/main/src/transformers/cache_utils.py#L672) `class Cache` 里找到：

```python
    def update(
        self, key_states: torch.Tensor, value_states: torch.Tensor, layer_idx: int, *args, **kwargs
    ) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Updates the cache with the new `key_states` and `value_states` for the layer `layer_idx`.

        Parameters:
            key_states (`torch.Tensor`):
                The new key states to cache.
            value_states (`torch.Tensor`):
                The new value states to cache.
            layer_idx (`int`):
                The index of the layer to cache the states for.

        Return:
            A tuple containing the updated key and value states.
        """
        # In this case, the `layers` were not provided, and we must append as much as `layer_idx`
        if self.layer_class_to_replicate is not None:
            while len(self.layers) <= layer_idx:
                self.layers.append(self.layer_class_to_replicate())

        if self.offloading:
            # Wait for the stream to finish if needed, and start prefetching the next layer
            torch.cuda.default_stream(key_states.device).wait_stream(self.prefetch_stream)
            self.prefetch(layer_idx + 1, self.only_non_sliding)

        keys, values = self.layers[layer_idx].update(key_states, value_states, *args, **kwargs)

        if self.offloading:
            self.offload(layer_idx, self.only_non_sliding)

        return keys, values
```

这里它首先把当前层的 KV 存起来：

```python
if self.layer_class_to_replicate is not None:
    while len(self.layers) <= layer_idx:
        self.layers.append(self.layer_class_to_replicate())
```

> **机制**：`self.layers` 是一个列表，每个元素代表一个层的缓存对象。如果当前索引超出了列表长度，就用 `self.layer_class_to_replicate`（一个可调用的类，例如 `CacheLayer`）创建新的缓存层实例并追加。这样可以在模型运行过程中动态添加层，无需预先分配所有层。

然后还有预取下一层数据：

```python
if self.offloading:
    torch.cuda.default_stream(key_states.device).wait_stream(self.prefetch_stream)
    self.prefetch(layer_idx + 1, self.only_non_sliding)
```

> **等待预取完成**：`prefetch_stream` 是用于异步数据加载的 CUDA 流。`wait_stream` 确保当前默认流等待预取流完成，避免数据竞争。
>
> **预取下一层**：调用 `self.prefetch(layer_idx + 1, ...)` 提前将下一层所需的缓存数据从 CPU 加载到 GPU，为后续步骤做好准备，减少 GPU 空闲时间。

最后要更新当前层缓存：

```python
keys, values = self.layers[layer_idx].update(key_states, value_states, *args, **kwargs)
```

这里的 `layer.update()` 根据 `layer` 的种类有不同的实现，但是我找到了最明显的 `DynamicLayer` [link](https://github.com/huggingface/transformers/blob/main/src/transformers/cache_utils.py#L308)：

```python
def update(
    self, key_states: torch.Tensor, value_states: torch.Tensor, *args, **kwargs
) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Update the key and value caches in-place, and return the necessary keys and value states.

    Args:
        key_states (`torch.Tensor`): The new key states to cache.
        value_states (`torch.Tensor`): The new value states to cache.

    Returns:
        tuple[`torch.Tensor`, `torch.Tensor`]: The key and value states.
    """
    # Lazy initialization
    if not self.is_initialized:
        self.lazy_initialization(key_states, value_states)

    self.keys = torch.cat([self.keys, key_states], dim=-2)
    self.values = torch.cat([self.values, value_states], dim=-2)
    return self.keys, self.values
```

可以很清晰的看到这里做了 `cat` 拼接操作，把新的 KV 拼接到旧的之后再返回出来.
