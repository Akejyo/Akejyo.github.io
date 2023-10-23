---
title: "强迫症患者"
date: 2022-3-1
tags:
  - DP
  - ACM课程
---

, upper_bound的使用

最长不降子序列, upper_bound的使用

<!-- more -->

# L. 强迫症患者 

**题意**: 给定一个整数数组，每次操作可以改变其中的一个数为**另一个整数**，求使数组严格递增所需要的最少操作次数。

***

分析：假如改变数时可以改变为任意数（包括小数），那么这个题就是求最长上升序列。

最长上升序列的求法：开一个新数组b，每次添加a[i]到b数组时，当遇到$a[i]<a[i-1]$，那么就用a[i]来**替换**b里**第一个**大于等于a[i]的b[j]，因为显然a[i]放到那个位置是最优的。

重新回到该题，该题多了限制条件：只能改变成整数。这个条件会导致如果直接按照最长上升序列去写的话，a[i]替换b[j]的步骤就会出现问题，因为i到j之间可能距离非常大，而a[i]和b[j]的差值又非常小，这时候去替换可能会使i到j之间的数被卡死了。

举一个例子：数组[1,2,4,3,5]，直接最长上升序列写得到的是[1,2,4,5]或[1,2,3,5]，但你会发现这显然是不合理的，无论是3还是4，都不能在只改变一个值的情况下使整个数组严格递增。因为在处理b数组时，本来那个3（或4）是可以变成一个小数插到前面去的，但实际上3只能变成整数。

那么a[i]去更新b数组时什么情况才是合理的呢？我们会发现只有满足$a[i]-b[j]>=i-j$时才能去替换，即要满足$a[i]-i>=b[j]-j$。所以这个问题就转换成了求$a[i]-i$的最长不降子序列。用upper_bound优化时间。

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
const ll MOD = 998244353;
const int N = 1e5 + 10;
int n, m;
int w;
int len = 1;
int a[N], ins[N];//ins[i]是长度为i的最长子序列的最后一个元素
void solve() {
	sii(n, w);
	for (int i = 1; i <= n; i++) {
		int tem; si(tem);
		a[i] = tem - i;
	}
	ins[1] = a[1];
	for (int i = 2; i <= n; i++)
		if (ins[len] >= a[i]) {
			int tem = upper_bound(ins + 1, ins + len + 1, a[i]) - ins;
			ins[tem] = a[i];
			len = max(tem, len);
		}
		else if(a[i]>ins[len])
			ins[++len] = a[i];
	printf("%lld\n", (ll)(n - len) * (ll)w);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}/*10 2
1 2 3 3 3 4 5 3 4 5*/

```

