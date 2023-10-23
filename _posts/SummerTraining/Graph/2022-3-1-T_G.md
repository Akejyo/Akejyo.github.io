---
title: "我彻底理解了V圈！"
date: 2022-3-1
tags:
  - Graph
  - ACM课程
---

最小路径覆盖

<!-- more -->

# T. 我彻底理解了V圈！ 

**题意**：给定一个有向无环图，求最小路径覆盖

由于每个点**最多只有一个入边一个出边**，显然最小路径的数量为**点数**-**边数**。点数是固定的，所以我们求边数最大即可。

***

### 

对一个节点a，当我们想将a指向b，但b已经被其他点c指向的时候，可以判断一下是否能做到断开c->b让c连其他点，然后连a->b，这样边数就能加一。

```
bool jud(int u) {//判断能不能断开重连一条
	for (auto v : e[u])
		if (!vis[v]) {
			vis[v] = 1;                   //two记录点的入边的那个点
			if (!two[v] || jud(two[v])) {//这条点没用过或者对于v可以可以断一条（重连另一条）
				two[v] = u;
				return true;//边数加一
			}
		}
	return false;
}
```

***

```
#include <bits/stdc++.h>
#define si(a) scanf("%d",&a)
#define sii(a,b) scanf("%d%d",&a,&b)
#define siii(a,b,c) scanf("%d%d%d",&a,&b,&c)
#define fl float
#define ll long long int
#define ull unsigned long long int
using namespace std;
int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
int jd(int a) { return a < 0 ? (a * -1) : a; }
vector<int>e[12010];
vector<int>e2[12010];
set<int>pp;
int vis[12010];
int two[12010];// two[i] -> i
int p_cut;
bool jud(int u) {
	for (auto v : e[u])
		if (!vis[v]) {
			vis[v] = 1;
			if (!two[v] || jud(two[v])) {//这条点没用过或者可以断一条（重连另一条）
				two[v] = u;
				return true;
			}
		}
	return false;
}
void twomax(int u) {
	if (vis[u])
		return;
	vis[u] = 1;
	for (auto v : e[u]) {
		if (!vis[v]) {
			vis[v] = 1;
			if (!two[v]) {
				two[v] = u;//v和u连
				p_cut++;
				return;
			}
			else {
				if (jud(two[v])) {//找v所连边后有没有合理的边了
					two[v] = u;
					p_cut++;
					return;
				}
			}
		}
	}
}
void solve() {
	int n, m;
	sii(n, m);
	for (int i = 0; i < m; i++) {
		int a, b; sii(a, b);
		e[a].push_back(b);
	}
	for (int i = 1; i <= n; i++) {
		if (!e[i].empty()) {
			memset(vis, 0, sizeof(int)*(n+1));
			twomax(i);
		}
	}
	printf("%d", n - p_cut);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

