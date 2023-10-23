---
title: "顶点游走"
date: 2022-3-1
tags:
  - DP
  - ACM课程
---

树上DP

<!-- more -->

# R.顶点游走

**题意**: $n$个节点的树，每个节点$i$有权值$a_i$，从$1$号节点出发求和$a_i$，当$sum<0$时$sum$会自动变为$0$，可以从树上任意节点结束。求$sum_{max}$

***

**分析**: 我们可以这样考虑每个节点：从该节点以后会存在$sum$归零情况或不会。分别设为$F[i][0]$和$F[i][1]$

* 若考虑$sum$不会归零，dfs里每一节点$F[i][1]$都加上$max\,\{0,F[j][1]\}$,(j取i儿子)；

  ~~~
  F[u][1] += max(F[v][1], 0LL);//F[u][1]初始为w[u]
  ~~~

* 若考虑$sum$会归零，我们可以先将该点的值$F[i][0]$设为$0$，用$0$把后面一堆负数全部提前解决了再处理。

  ~~~
  F[u][0] += max(F[v][0], F[v][1]);//F[u][0]初始为0
  ~~~


最后$ans$取$max\,\{F[1][0],F[1][1]\}$

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
//const ll MOD = 924844033;
const int N = 5e5 + 10;
int n, m;
int flag;
int vis[N], vis2[N];
ll F[N][2], w[N];
vector<int>e[N];
void dfs(int u) {
	if (vis[u])
		return;
	vis[u] = 1;
	F[u][1] = w[u];
	for (auto v : e[u]) {
		if (!vis[v]) {
			dfs(v);
			F[u][1] += max(F[v][1], 0LL);//不会变成0，直接求和
			F[u][0] += max(F[v][0], F[v][1]);//假设后面会变成0，也就是会有一段负的，F[u][0]初始为0把所有负的干了
		}
	}
}
void solve() {
	si(n);
	for (int i = 1; i < n; i++) {
		int a; scanf("%d", &a);
		e[a].push_back(i + 1);
		e[i + 1].push_back(a);
	}
	for (int i = 1; i <= n; i++) scanf("%lld", &w[i]);
	dfs(1);
	printf("%lld", max(F[1][0],F[1][1]));
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

