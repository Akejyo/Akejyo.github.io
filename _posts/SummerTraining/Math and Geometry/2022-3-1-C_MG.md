---
title: "回转数"
date: 2022-3-1
tags:
  - Geometry
  - ACM课程
---

回转数

<!-- more -->

# C. 回转数

**题意**:给定n个点，顺次连接这些点得到折线。m次询问，每次给出一个点，询问折线绕该点的回转数

***

如果暴力用atan2去算每个每个角度来计算，虽然每次询问的复杂度是O(n)，但atan2的计算很耗时间，会TLE。本题需要用光线投影法来做。

首先需要特判该点是否在折线的边/顶点上，如果不在，做一条过该点的直线**L**（射线也行），遍历折线上的每条边，判断**L**是从边的哪个方向穿过去的（折线顺次连接，有方向性）。从左到右穿过去ans+1，从右到左穿过去则ans-1，最终的结果即为ans/2（因为前面取的是直线，所以会穿两边）。

简化考虑，取直线为过该点的水平直线，那么之后只要做一下toleft检测和y坐标的比较就行了。

***

```
#include <bits/stdc++.h>
template<typename T>
inline void read(T& x) { x = 0; char c = getchar(); while (!isdigit(c))c = getchar(); while (isdigit(c)) { x = x * 10 + c - '0'; c = getchar(); } }
#define si(a) read(a)
#define sii(a,b) read(a),read(b)
#define siii(a,b,c) read(a),read(b),read(c)
#define fl double
#define ll long long int
#define ull unsigned long long int
#define T ll
using namespace std;
const ll MOD = 1e9 + 7;
const int N = 2e5 + 10;//                       这个容易改的啊！！！！！！！
//int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
struct Point { T x, y; };
struct Segment { Point a, b; };
struct Line { Point p, v; };
struct Polygon { vector<Point> p; };
T Dot_p(Point a, Point b) { return a.x * b.x + a.y * b.y; }//点积
T Cro_p(Point a, Point b) { return a.x * b.y - a.y * b.x; }//叉积
T to_left(Point p, Line X) { return Cro_p({ p.x - X.p.x,p.y - X.p.y }, X.v); }//正→右边、负→左边
Point make_vector(Point A, Point B) { return { B.x - A.x,B.y - A.y }; }//点合成向量A→B
bool p_on_seg(Point p, Segment l) {//点在线段上
	if (to_left(p, { l.a,make_vector(l.a,l.b)}) != 0)return false;
	if (p.x >= min(l.a.x, l.b.x) && p.x <= max(l.a.x, l.b.x)) return true;
	return false;
}
bool p_on_line(Point a, Line l) {//点在直线上
	if (Cro_p(l.v, make_vector(a,l.p)) == 0)return true;
	return false;
}
bool seg_c_seg(Segment a, Segment b) {//线段相交
	if (p_on_seg(a.a, b) || p_on_seg(a.b, b) || p_on_seg(b.a, a) || p_on_seg(b.b, a))return true;//端点在线段上
	Point av =make_vector(a.a,a.b), bv = make_vector(b.a,b.b);//A→B的方向
	if (to_left(a.a, { b.b,bv }) * to_left(a.b, { b.b,bv }) > 0)return false;
	if (to_left(b.a, { a.b,av }) * to_left(b.b, { a.b,av }) > 0)return false;
	return true;
}
Polygon P;
bool check(Point p) {
	int p_sz = P.p.size();
	//for (int i = 0; i < p_sz; i++)if (p.x == P.p[i].x && p.y == P.p[i].y)return false;
	for (int i = 0; i < p_sz; i++)
		if (p_on_seg(p, { P.p[i],P.p[(i + 1) % p_sz] }))return true;
	return false;
}
ll huizhuan(Point p) {
	int p_sz = P.p.size();
	ll res = 0;
	for (int i = 0; i < p_sz; i++) {
		Segment tmp = { P.p[i],P.p[(i + 1) % p_sz] };
		ll wtf;
		if (p.y >= min(tmp.a.y, tmp.b.y) && p.y < max(tmp.a.y, tmp.b.y)) {//一个带等于一个不带，这样顶点只会记一次
			wtf = to_left(p, { tmp.a,make_vector(tmp.a,tmp.b) });
			if (wtf > 0)res--;
			else if (wtf < 0)res++;
		}
	}
	return res/2;
}
void solve() {//         快读不能读负数啊！！！ 交互不能快读啊！！！╰(艹皿艹)
	si(n);
	for (int i = 1; i <= n; i++) {
		T x, y; scanf("%lld %lld", &x, &y);
		P.p.push_back({ x,y });
	}
	si(m);
	for (int i = 1; i <= m; i++) {
		T x, y; scanf("%lld %lld", &x, &y);
		Point cao = { x,y };
		if (check(cao)) { puts("EDGE"); continue;}
		printf("%lld\n",huizhuan(cao));
	}
}
int main() {
	int t;
	t = 1;
	//si(t);
	while (t--)
		solve();
	return 0;
}
```

