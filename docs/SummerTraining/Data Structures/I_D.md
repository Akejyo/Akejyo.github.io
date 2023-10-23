---
title: "Namesolo 拜师"
date: 2022-3-1
tags:
  - Data Structures
  - ACM课程
---

并查集

<!-- more -->

# I. Namesolo 拜师

**题意**：给定一个有n个点的无向图，有两个操作：

1. 添加一条连接a,b的边
2. 询问a,b是否在同一连通块

***

### 并查集及其优化

**普通并查集**:

```
int getfa(int x){ return fa[x] == x ? x : getfa(fa[x]); }
```

​	直接去递归查询，但是重复很多无用的操作，效率低。

**优化1**：**路径压缩**

```
int getfa(int x) { return fa[x] == x ? x : fa[x] = getfa(fa[x]); }
```

​    查询路径上的每个节点都直接连到根上，就是边跑边连

**优化2**：**启发式合并**（**按秩合并**）

> OI wiki:  具体来说，如果我们将一棵点数与深度都较小的集合树连接到一棵更大的集合树下，显然相比于另一种连接方案，接下来执行查找操作的用时更小（也会带来更优的最坏时间复杂度）。  [并查集 - OI Wiki (oi-wiki.org)](https://oi-wiki.org/ds/dsu/) 

```
if (S[x] <= S[y]) //S[i]是子树i的大小
	fa[x] = y,S[y] += S[x];//把小的那个连到大的里去
else 
	fa[y] = x,S[x] += S[y];
```

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
const ll MOD = 1e9 + 7;
int n, m, r;
int fa[5000100];
inline signed gf(int x) { return fa[x] == x ? x : fa[x] = gf(fa[x]); }
//inline signed gf(int x) { return fa[x] == x ? x : gf(fa[x]); }
vector<ll>S(5000100, 1);
int mer[5000100];
ll an = 0;

#define getchar() (frS==frT&&(frT=(frS=frBB)+fread(frBB,1,1<<15,stdin),frS==frT)?EOF:*frS++)
char frBB[1 << 15], * frS = frBB, * frT = frBB;
template<typename T>
inline void read(T& x) {
	x = 0; char c = getchar();
	while (!isdigit(c))c = getchar();
	while (isdigit(c)) { x = x * 10 + c - '0'; c = getchar(); }
}

void solve() {
	sii(n, m);
	int cut = 0;
	for (int i = 1; i <= n; i++)
		fa[i] = i;
	for (int i = 1; i <= m; i++) {
		int op, u, v;
		read(op) ;
		read(u);
		read(v);
		int x, y;
		x = gf(u); y = gf(v);
		if (op == 1) {
			if (x != y) {
				if (S[x] <= S[y]) {
					fa[x] = y;
					S[y] += S[x];
				}
				else {
					fa[y] = x;
					S[x] += S[y];
				}
			}
		}
		else {
			if (x == y) {
				an *= 2;
				an += 1;
				an %= MOD;
			}
			else {
				an *= 2;
				an %= MOD;
			}
		}
	}
	printf("%lld", an);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

