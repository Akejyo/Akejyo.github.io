---
title: "tarjan"
date: 2022-3-1
tags:
  - Graph
  - ACM课程
---

Tarjan，无向简单图的割点，割边，极大点双连通分量，极大点双连通分量包含边数的最大值

<!-- more -->

# J. tarjan

**题意**：求无向简单图的割点，割边，极大点双连通分量，极大点双连通分量包含边数的最大值

### ~~论tarjan的一百种用法~~

***

* 先解决点双的问题

  跑$dfs$确定$dfn$和$low$($I$题里有)，对于节点$u$，在跑它的邻居的时候，只要这个邻居$v$没跑过就把$u-v$这条边压入栈内，当遇到$low[v] >= dfn[u]$时（这不一定是割点），把栈内的边一直弹出到$u-v$($u-v$不弹)，弹出的这些点构成了一个点双。把这些点存到一个$set$里，针对$set$里的这些点跑$dfs$来确定这个点双的边数，同时更新最大边数。

* 然后是割点和割边，上面已经跑完了$dfs$，$dfn$和$low$都确定好了，再来一次$dfs$就行。对于割点，根节点的判断要注意一下，根必须要有至少两个子树才能作为割点（1 2; 2 3; 3 1.根只有一个子树，不是割点），非根节点只要有$low[v]>=dfn[u]$就可确定u是割点，v可以回溯到比u还远的位置（或者就是），那显然u就是割点。对于割边$low[v]>dfn[u]$就行。

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
vector<int> e[500000];
int dfn[1010], low[1010];
int vis[1010];
int cut;
int gedian, gebian;//割点割边数量
int re[1010];//记录割点
int ge_cut, ge_max = 0, gege ;//极大点双数量，最多边，cut
int flag;
stack<int> fir;
stack<int> sec;
set<int> mer;
int vis_s[1010];
void dfs_s(int u) {
	if (!vis_s[u])
		vis_s[u] = 1;
	for (auto v : e[u]) {
		if (mer.find(v) != mer.end()) {
			gege++;
			if (!vis_s[v])
				dfs_s(v);
		}
	}
}
void tarjan(int u, int fa) {
	dfn[u] = ++cut;
	low[u] = cut;
	for (auto v : e[u]) {
		if (!dfn[v]) {
			fir.push(u);
			sec.push(v);
			tarjan(v, u);
			low[u] = min(low[u], low[v]);
			if (low[v] >= dfn[u]) {//遇到割点
				mer.clear();
				ge_cut++;
				gege = 0;
				int temx, temy;
				do {
					temx = fir.top();
					temy = sec.top();
					mer.insert(temx);
					mer.insert(temy);
					fir.pop();
					sec.pop();
				} while (temx != u || temy != v);
				memset(vis_s, 0, sizeof(vis_s));
				dfs_s(u);
				gege /= 2;
				ge_max = max(ge_max, gege);
			}
		}
		else if (v != fa)//判断是否是它爸，不能是爸（
			low[u] = min(dfn[v], low[u]);
	}
}
void gegege(int u, int root) {
	vis[u] = 1;
	int s_tree = 0;//子树数量
	for (auto v : e[u]) {
		if (!vis[v]) {
			s_tree++;
			if (low[v] >= dfn[u]) {
				if (u != root) {// 要特判一下根处
					if (!re[u]) {
						gedian++;
						re[u] = 1;
					}
				}
				else if (s_tree >= 2) {
					if (!re[u]) {
						gedian++;
						re[u] = 1;
					}
				}
			}
			if (low[v] > dfn[u])
				gebian++;
			gegege(v, root);
		}
	}
}
void solve() {
	int n, m;
	sii(n, m);
	for (int i = 0; i < m; i++) {
		int u, v; sii(u, v);
		e[u].push_back(v);
		e[v].push_back(u);
	}
	for (int i = 1; i <= n; i++) {
		if (!dfn[i]) {
			tarjan(i, i);
			gegege(i, i);
		}
	}
	printf("%d %d %d %d", gedian, gebian, ge_cut, ge_max);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

