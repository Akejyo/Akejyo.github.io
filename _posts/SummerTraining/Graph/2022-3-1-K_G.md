---
title: "居民们都住在房屋里"
date: 2022-3-1
tags:
  - Graph
  - ACM课程

---

LCA，无向连通图求任意两点之间的最近距离

<!-- more -->

# K. 居民们都住在房屋里

**题意**：一个无向连通图，求任意两点之间的最近距离。

***

因为询问距离的次数会很多，肯定不能它问一次你跑一次最短路，需要对图进行预处理。

先随便弄给点当根节点，如果我们能知道所有点的深度$deep[i]$，那么两个点$u$和$v$之间的距离即为$deep[u]+deep[v]-2*deep[LCA(u,v)]$，其中$LCA(u,v)$为$u$和$v$的公共祖先。

### LCA

* 深度可以用$bfs$求，每求一层深度加一。

* 可以选择暴力求公共祖先，对于$u$和$v$两个点，每次更新更深的那一个

~~~
int getlca(int a, int b) {
	while (a != b) {
		if (deep[a] > deep[b])
			a = fa[a];
		else
			b = fa[b];
	}
	return a;
}
~~~

该题的数据似乎没卡这种暴力，如果卡的话可以利用倍增算法：

>  [最近公共祖先 - OI Wiki (oi-wiki.org)](https://oi-wiki.org/graph/lca/) 
>
> 用$fa_{x,i}$表示x的第$2^i$个祖先。先将u，v调整到同一深度得到u，v的深度差$y$，将$y$二进制拆分，第y次游标跳转优化成y的二进制中1的个数。之后，从最大的i开始循环尝试，一直尝试到0，若$fa_{u,i}\neq fa_{v,i}$，更新u为$fa_{u,i}$，v为$fa_{v,i}$，最后得到LCA为$fa_{u,0}$。

***

```
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <set>
#include <map>
#include <string>
#include <stack>
#include <queue>
#include <malloc.h>
#include <string.h>
#include <math.h>
#include <algorithm>
#define si(a) scanf("%d",&a)
#define sii(a,b) scanf("%d%d",&a,&b)
#define siii(a,b,c) scanf("%d%d%d",&a,&b,&c)
#define fl float
#define ll long long int
#define ull unsigned long long int
using namespace std;
int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
int mmm(int a, int b) { if (a < b) return a; else return b; }
int bbb(int a, int b) { if (a > b) return a; else return b; }
int jd(int a) { return a < 0 ? (a * -1) : a; }
struct edge {
	int v;
	int val;
};
//vector<edge> e[5010];
int deep[500010];
int fa[500010];
bool vis[500010];
vector <int> T[500010];
queue<int> Q;
int getlca(int a, int b) {
	while (a != b) {
		if (deep[a] > deep[b])
			a = fa[a];
		else
			b = fa[b];
	}
	return a;
}
void ask() {
	int a, b;
	sii(a, b);
	int lca = getlca(a, b);
	printf("%d\n", deep[a] + deep[b] - 2 * deep[lca]);
}
void bfs(int u) {
	while (!Q.empty()) Q.pop();
	Q.push(u);
	vis[u] = true;
	deep[u] = 0;
	while (!Q.empty()) {
		u = Q.front();
		Q.pop();
		for (auto it : T[u]) {
			if (!vis[it]) {
				Q.push(it);
				vis[it] = true;
				deep[it] = deep[u] + 1;
				fa[it] = u;
			}
		}
	}
}
void solve() {
	int i, j;
	int n, m, s;
	sii(n, m);
	for (i = 1; i <= n - 1; i++) {
		int a, b;
		sii(a, b);
		T[a].push_back(b);
		T[b].push_back(a);
	}
	fa[1] = fa[1];
	bfs(1);
	while (m--)
		ask();
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

