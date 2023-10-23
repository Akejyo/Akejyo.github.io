---
title: "兔儿爷"
date: 2022-3-1
tags:
  - Geometry
  - ACM课程

---

toleft

<!-- more -->

# E.兔儿爷

**题意**：给你三种药水，每种药水含有A物质$a_i$mg/l和B物质$b_i$mg/l，n次询问，每次询问是否可以用给定的三种药水调制出含A物质$x$mg/l和$y$mg/l的药水。

***

其实就是问(x,y)是否在($a_1,b_1$)，($a_2,b_2$)，($a_3,b_3$)组成三角形内或边上。这题合理的做法是用toleft检测，但由于写这题时还没学计算几何，所以用了向量解方程的方法来写。

设原来的三个点为A,B,C，询问的点为P，计算得到$\vec{AB}$，$\vec{AC}$，$\vec{AP}$，那么就可以设$\vec{AP}=u\vec{AB}+v\vec{AC}$，最后解出来的u和v，满足u>=0，v>=0，u+v<=1即可，同时需要特判一下在边上的情况。

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
const int N = 5e5 + 10;
//int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
void solve() {
	ll a1, a2, a3;
	ll b1, b2, b3;
	sii(a1, b1);
	sii(a2, b2);
	sii(a3, b3);
	ll x1, x2, x3, y1, y2, y3;
	x2 = a2 - a1, y2 = b2 - b1;
	x3 = a3 - a1, y3 = b3 - b1;
	
	if (x2 * y3 != x3 * y2) {
		int t; si(t);
		while (t--) {
			ll x, y;
			sii(x, y);
			x1 = x - a1, y1 = y - b1;
			ll u_son = x1 * y3 - x3 * y1, u_ma = x2 * y3 - x3 * y2;
			ll v_son = x1 * y2 - x2 * y1, v_ma = x3 * y2 - x2 * y3;
			if (u_son == 0)
				if (v_son * v_ma >= 0 && abs(v_son) <= abs(v_ma)) {
					printf("YES\n");
					continue;
				}
			if (v_son == 0)
				if (u_son * u_ma >= 0 && abs(u_son) <= abs(v_son)) {
					printf("YES\n");
					continue;
				}
			if (u_son * u_ma >= 0 && v_son * v_ma >= 0 && abs(u_son * v_ma) + abs(v_son * u_ma) <= abs(v_ma * u_ma)) {
				printf("YES\n");
				continue;
			}
			printf("NO\n");
		}
	}
	else {
		int t; si(t);
		while (t--) {
			ll x, y;
			sii(x, y);
			x1 = x - a1, y1 = y - b1;
			if (x2 == 0 && y2 == 0 && x3 == 0 && y3 == 0) {
				if (x1 == 0 && y1 == 0) {
					printf("YES\n");
					continue;
				}
			}
			else if (x2 == 0 && y2 == 0) {
				if (x1 * y3 == x3 * y1 && x1 <= max(0LL, x3) && x1 >= min(0LL,x3)) {
					printf("YES\n");
					continue;
				}
			}
			else if (x3 == 0 && y3 == 0) {
				if (x1 * y2 == x2 * y1 && x1 <= max(x2, 0LL) && x1 >= min(0LL,x2)) {
					printf("YES\n");
					continue;
				}
			}
			else if (x2 == x3 && y2 == y3) {
				if (x1 * y3 == x3 * y1 && x1 <= max(x2, 0LL) && x1 >= min(0LL, x2)) {
					printf("YES\n");
					continue;
				}
			}
			else {
				if (x1 * y2 == x2 * y1 || x1 * y3 == x3 * y1) {
					if (x1 <= max(x2, max(0LL,x3)) && x1 >= min(x2, min(0LL,x3))) {
						printf("YES\n");
						continue;
					}
				}
			}
			printf("NO\n");
		}
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

