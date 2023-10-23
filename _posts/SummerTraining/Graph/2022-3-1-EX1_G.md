---
title: "补图联通块数量"
date: 2022-3-2
tags:
  - Graph
---

补图联通块数量

<!-- more -->

# EX.补图联通块数量

https://codeforces.com/gym/388925/problem/H
无向完全图，给你一些权值为1的边，其余边为0，求最小生成树

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
const ll MOD = 1e9 + 7;
const int N = 2e5 + 10;
//int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, d, m;
int fa[N];
inline signed gf(int x) { return x == fa[x] ? x : fa[x] = gf(fa[x]); }
//inline signed gf(int x) { return fa[x] == x ? x : fa[x] = gf(fa[x]); }
vector<int>e[N];
vector<int>now;//
map<int, int>mp;
int sz[N];
int ans = 0;
void solve() {
	sii(n, m);
	for (int i = 1; i <= m; i++) {
		int u, v; sii(u, v);
		e[max(u, v)].push_back(min(u, v));
	}
	for (int i = 1; i <= n; i++)fa[i] = i, sz[i] = 1;
	for (int i = 1; i <= n; i++) {
		mp.clear();
		for (auto it : e[i])mp[gf(it)]++;
		int x, y;
		for (int j = 0; j < now.size(); j++) {//遍历所有联通块
			x = gf(i),y = gf(now[j]);
			if (x != y)
				if (mp[y] < sz[y])//说明点与该连通块直接有0权边
					sz[y] += sz[x], fa[x] = y;
		}
		if (fa[i] == i)//更新连通块
			now.push_back(i);
	}
	for (int i = 1; i <= n; i++)
		if (fa[i] == i)ans++;
	printf("%d", ans-1);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
/*

*/
```

