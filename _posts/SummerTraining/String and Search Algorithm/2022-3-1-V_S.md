---
title: "生日蛋糕"
date: 2022-3-1
tags:
  - Search Algorithm
  - ACM课程
---

剪枝

<!-- more -->

# V. 生日蛋糕 

**题意**：体积n× π的m层蛋糕， 每层都是圆柱体，在下面的蛋糕的半径和高度（都是整数）都要大于在上面的蛋糕，蛋糕的表面积Q=S× π ,对于给定的n和m求蛋糕的最小S(无解输出0)

***

**搜索剪枝**：考虑到蛋糕的半径和高度都是整数，也就是说m层蛋糕的最小体积是可以计算得到的。dfs扫所有可行的半径和高度，其中半径和高度的max取上一层的半径和高度减一，最小值为m减当前层数+1。

对于剪枝，如果当前的体积加上剩余层数的最小值已经大于n了，说明体积n× π 的蛋糕做不出就退出。每次搜到一个结果就更新ans，如果当前面积加剩余层数的最小面积大于ans就退出。

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
//const ll MOD = 924844033;
const int N = 2e6 + 10;
//int n, m;
int n, m;
int ans=114514;
int rest[10010];
void REST() { for (int i = m, j=0; i >= 1; i--) rest[++j] = i * i * (i + 1) * (i + 1) / 4; }
void dfs(int u, int s_pre, int v_pre, int r_last, int h_last, int s_ground) {
	int r_max = r_last-1, h_max=h_last-1;
	int r_min = 1 + m - u, h_min = r_min;
	if (u == m) {
		if (r_last == 1 || h_last == 1)
			return;
		for (int i = r_max, v = n - v_pre; i >= r_min; i--)
			for (int j = h_max; j >= h_min; j--)
				if (i * i * j == v)
					ans = m == 1 ? min(ans, i * i + s_pre + 2 * i * j) : min(ans, s_ground + s_pre + 2 * i * j);
		return;
	}
	for(int i = r_max;i>=r_min;i--)
		for (int j = h_max; j >= h_min; j--) {
			if (i * i * j + rest[u + 1] + v_pre > n) continue;
			if (u == 1) {
				if (i * i + s_pre + 2 * ((n - v_pre) / r_max) >= ans) continue;
			}
			else if(s_ground+s_pre + 2 * ((n - v_pre) / r_max) >= ans)
				continue;
			if (u == 1) s_ground = i * i;
			dfs(u + 1, s_pre + 2 * i * j, v_pre + i * i * j, i,j, s_ground);
		}
}
void solve() {
	sii(n, m);
	REST();
	if (rest[1] > n)
		printf("%d", 0);
	else {
		dfs(1, 0, 0, sqrt(n)+10000, sqrt(n)+10000, 114514);
		if (ans == 114514)
			printf("%d", 0);
		else
			printf("%d", ans);
	}
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



