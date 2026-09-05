---
title: "[Note] BeaconKV: Key-Value Cache Compression Guided by Beacon Queries for Efficient Large Reasoning Model Inference"
date: 2026-9-4
categories: [PaperNote, LLM]
tags: [KVCache]
math: true
image:
  path: /img/image-20260904221551713.png
---

[aiha-lab/BeaconKV: BeaconKV: Key-Value Cache Compression Guided by Beacon Queries for Efficient Large Reasoning Model Inference](https://github.com/aiha-lab/BeaconKV)

## What problem?

* CoT (Chain-of-Thought) brings memory bottleneck (KV Cache), limits the practical deployment of LRMs (Large Reasoning Models) under constrained GPU resources.

## Defects of previous solution

* They didn't notice the distinction between LRM inference and conventional long-context processing.
* They tried to approximate tokens' future importance by relying on recent queries at eviction time.
* However, this assumption **fails** in long-horizon reasoning: certain decoding steps generate TRT (Thought Revisiting Tokens) that re-attend to distant previous context.

## Core innovation

* **Key insight**: The reasoning-critical context is revisited by global queries that form **clusters** in the pre-RoPE query space. The diverse set of global queries can be represented by a compact set of beacon queries--representative queries for each global query clusters.
  * global queries: queries that attend to keys at substantially distant positions.
  * global queries form a coherent subset that is geometrically distinct from the majority of local queries.

## Unresolved vulnerabilities and possible improvement

#### 1. “几何多样性”不等于“未来重要性”

FPS 选择的是最不相似、覆盖面最广的 query，但离群 query 可能只是噪声，而非未来 TRT 的代表。其核心假设——global query 会稳定聚类且可预测未来 attention——缺少更广泛验证。

**可能改进：**

- 结合 attention distance、历史访问频率和语义重要性；
- 使用 density-aware FPS，降低异常值影响；
- 对 beacon 设置效用分数和淘汰机制。

#### 2. 当前位置 RoPE 对齐是一种启发式近似

将历史 beacon query 旋转到当前位置，并不一定能真实模拟未来 TRT。特别是在长距离外推、不同 RoPE scaling 或非 RoPE 模型上可能产生偏差。

**可能改进：**

- 使用多个候选未来位置进行 scoring；
- 学习或校准 position-remapping；
- 对 ALiBi、相对位置编码等架构设计专用版本。

#### 3. Max aggregation 容易产生假阳性

只要某个 beacon 对某个 KV 给出高分，该 KV 就会被保留。异常 query 或单个 head 的尖峰可能占用大量预算，挤掉真正重要的内容。

**可能改进：**

- 使用 top-k*k* mean、分位数或温度化 LogSumExp；
- 增加跨 head 一致性；
- 对 beacon 设置置信度权重。

#### 4. Eviction 不可逆且可能累积错误

某个关键 KV 一旦被错误删除，后续 beacon 无法恢复它。长推理中多轮 eviction 可能形成级联误差，使 query 分布进一步偏移。

**可能改进：**

- 周期性 dense rectification；
- 将低置信度 KV 暂存到 CPU/SSD；
- 使用压缩摘要或量化副本，而非直接永久删除；
- 监测模型不确定性并触发缓存恢复。

#### 5. 固定的 local/global 配额并非普适

消融实验显示 beacon 太多会降低局部连贯性并显著增加延迟；beacon 太少又无法覆盖 TRT。论文采用 `16 recent + 16 beacon`，但这只是经验折中。

**可能改进：**

根据 attention entropy、TRT 频率、任务阶段及剩余显存动态分配两类 query。

#### 6. 系统开销仍然存在

BeaconKV需要保存额外 query、运行 FPS，并在 eviction 时计算 beacon-to-cache attention。相同 budget 下，其吞吐略低、延迟略高于 RPC；在小 batch 或短序列上可能得不偿失。

**可能改进：**

- 降低 FPS 执行频率；
- 跨 head 共享 beacon；
- 使用近似最近邻或低维投影；
- 设计融合 CUDA kernel。

#### 7. Prefix 永久保留可能侵占预算

方法始终保留 prefix 和最近 token。当 prompt 很长时，prefix 本身可能占据大部分预算，从而限制中间推理轨迹的可用空间。

**可能改进：**

对 prefix 也进行分层压缩，只硬保留指令和问题约束等关键部分。

#### 8. 实验论证仍不充分

TRT 聚类分析主要依赖少量可视化案例和特定 layer/head；缺少：

- 不同模型上聚类稳定性的定量指标；
- TRT 识别的 precision/recall；
- 多次采样的方差和显著性检验；
- 超过 32K 长度下的误差累积实验；
- adversarial retrieval 或关键事实只出现一次的测试。

此外，不同 baseline 对 recent tokens 的保留数量并不完全一致，可能影响公平性。