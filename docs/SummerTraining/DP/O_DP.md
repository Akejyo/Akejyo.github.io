---
title: "宝可梦"
date: 2022-3-1
tags:
  - DP
  - ACM课程
---

多重背包，二分优化

<!-- more -->

# O. 宝可梦 

**题意**：多重背包

***

**朴素做法**：

1. 硬塞，这类物品有多少个就在数组里塞多少个，然后做01背包(TLE)

2. 枚举第$i$个物品拿了多少个：

   设$dp[i][j]$为拿来前i种物品，价值为j的答案

   有状态转移方程: $dp[i][j]=max\,\{dp[i-1][j-k*c]+k*v\}(0<=k<=m)$

**二分优化**：

​	对于任何一个正数$x$，都可以用一系列二的幂来表示。比如$15=2^0+2^1+2^2+7$。且用拆出来的这几个数相加可以得到$1$到$x$中的任意数：$1=1;2=2;3=1+2;4=4;5=1+4;6=2+4;7=1+2+4;8=1+7;9=2+7;10=1+2+7;11=4+7......$

所有我们对每个$m_i$都这样处理后，然后跑01背包即可。

***

```
#include <bits/stdc++.h>
template<typename T>
inline void read(T& x) { x = 0; char c = getchar(); while (!isdigit(c))c = getchar(); while (isdigit(c)) { x = x * 10 + c - '0'; c = getchar(); } }
#define si(a) read(a)
#define sii(a,b) read(a),read(b)
#define siii(a,b,c) read(a),read(b),read(c)
#define fl float
#define ll long long int
#define ull unsigned long long int
using namespace std;
int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
int jd(int a) { return a < 0 ? (a * -1) : a; }
const int MOD = 1e9 + 7;
const int N = 1e5 + 10;
int n, m, W;
ll v[N], w[N], num[N];
ll dp[44444];
int cut;
void solve() {
	sii(n, W);
	for (int i = 1; i <= n; i++) {
		ll a, b, c; siii(a, b, c);
		ll tem = 1;
		while (tem <= c)//二进制拆分
			v[++cut] = a * tem, w[cut] = b * tem, c -= tem, tem <<= 1;
		v[++cut] = a * c, w[cut] = b * c;
	}
	for (int i = 1; i <= cut; i++)
		for (int j = W; j >= w[i]; j--)
			dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
	printf("%lld", dp[W]);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}

```

