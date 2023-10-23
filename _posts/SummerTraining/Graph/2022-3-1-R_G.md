---
title: "建设道路2"
date: 2022-3-1
tags:
  - Graph
  - ACM课程
---

朱刘算法求最小树形图

<!-- more -->

# R. 建设道路2 

**题意**：给定一个有**n**个节点的有向图，起点为**r**，**m**条边（u->v权值w)，求每个**r**到每个点之和的最小值。

*就是求有向图的最小生成树，即最小树形图。*



### 朱刘算法（Edmods算法）

***

**算法流程**：

* 对每个点，选择它的**入边中权值最小**的那个边(根节点除外，根没入边)

  ```
  for (int i = 0; i < m; i++) {
  			int a, b;
  			a = e[i].v;
  			if ( ined[a] > (b = e[i].w)) {
  				ined[a] = b;//a点入边的权值
  				pre[a] = e[i].u;//a的入边的点
  			}
  		}
  ```

  

* 若出现环，将环缩点后更新其他点到环的距离。关于更新距离：

  1. 若这个边在环内则删去这条边
  2. 若该边的终点在环上，其权值更新为：**原来的权值**-**该点在环里对应入边的权值**

  

```
for (int i = 1; i <= n; i++) {
			if (i != root) {
				an += ined[i];//更新一下答案
				for (tem = i; tem != root && vis[tem] != i && !id[tem]; tem = pre[tem])
				    vis[tem] = i;     //不为根 + 未被访问过（防止一直跑环） + 未被缩环
					                 //赋值i，区分操作区间
				if (vis[tem] == i && tem != root) {//由于每个点都有入边，若满足该式，则必成环
					cut++;
					int flag = 1;
					for (int j = tem; flag || j != tem; j = pre[j]) {//把这个环的id统一一下，缩环
						flag = 0;
						id[j] = cut;
					}
				}
			}
		}
```



>  该算法还可以用Tarjan优化 [最小树形图 - OI Wiki (oi-wiki.org)](https://oi-wiki.org/graph/dmst/) 

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
int n, m, r;
struct road {
	int u, v;
	ll w;
	//bool friend operator < (road a, road b) { return a.w < b.w; }
};
int fa[10010];
inline signed gf(int x) { return fa[x] == x ? x : fa[x] = gf(fa[x]); }
ll an;
vector<road> e;
int flag, tem, root, cut;
int vis[110];
int id[110];//记录缩环标号
int pre[110];//pre[i]记录是i点的入边
ll ined[110];//入边边权(最小)
void START() {//初始化
	cut = 0;
	memset(ined, 88, sizeof(ined));
	memset(vis, 0, sizeof(vis));
	memset(id, 0, sizeof(id));
}
bool jud() {
	for (int i = 1; i <= n; i++) {
		if (ined[i] > 1e9 && i != root)//没有入边且不为根节点
			return true;
	}
	return false;
}
void Edmonds() {
	while (1) {
		START();
		for (int i = 0; i < m; i++) {
			int a, b;
			a = e[i].v;
			if ( ined[a] > (b = e[i].w)) {
				ined[a] = b;
				pre[a] = e[i].u;
			}
		}
		/*for (auto it : e) {
			if (ined[it.v] > it.w) {//每个点选它的入边里权值小的
				ined[it.v] = it.w;
				pre[it.v] = it.u;
			}
		}*/
		if (jud()) {
			an = -1;
			return;
		}
		for (int i = 1; i <= n; i++) {
			if (i != root) {
				an += ined[i];
				for (tem = i; tem != root && vis[tem] != i && !id[tem]; tem = pre[tem])//不为根 + 未被访问过（防止一直跑环） + 未被缩环
					vis[tem] = i;//赋值i，区分操作区间
				if (vis[tem] == i && tem != root) {//每个点都有入边，若满足该式，则必成环
					cut++;
					int flag = 1;
					for (int j = tem; flag || j != tem; j = pre[j]) {//把这个环的id统一一下，缩环
						flag = 0;
						id[j] = cut;
					}
				}
			}
		}
		if (!cut) return;//没缩环就能结束了
		for (int i = 1; i <= n; i++)
			if (!id[i])
				id[i] = ++cut;//给没缩环的点标号
		root = id[root];//更新根的标号
		/*for (int i = 0; i < m; i++) {
			int tem = e[i].v;
			e[i].u = id[e[i].u];
			e[i].v = id[tem];
			if (e[i].u != e[i].v) e[i].w -= ined[tem];
		}*/
		int sum = 0 ;
		for (int i = 0; i < m; i++)
			if (id[e[i].u] != id[e[i].v]) //如果边的两点标号不一样,覆盖、更新
				e[sum++] = { id[e[i].u],id[e[i].v],e[i].w - ined[e[i].v] };
		n = cut;
		m = sum;
	}
}
void solve() {
	siii(n, m, r);
	root = r;
	int sum = 0;
	for (int i = 0; i < m; i++) {
		int a, b, c;
		siii(a, b, c);
		if (b != r && a != b) {//指向根的不要，自环不要
			e.push_back({ a,b,(ll)c });
			sum++;
		}
	}
	m = sum;//更新边数
	Edmonds();
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

