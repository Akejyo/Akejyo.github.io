---
title: "代码查重"
date: 2022-3-1
tags:
  - DP
  - ACM课程
---

<!-- more -->

# A. 代码查重

**题意**: 有$A$，$B$两个字符串，求$f(a,b)_{max} = x*LCS(a,b)-y*|a|-z*|b|$，其中$x$,$y$,$z$是题目里给的常数，$a$,$b$是$A$,$B$在子串。

***

分析：设$dp(i,j)$为$A$的前$i$位，$B$的前$j$位的最大答案值。转移的时候，对于$a[i]$位和$b[j]$位，可以分为$a[i]=b[j]$和$a[i]\neq b[j]$两种：

* 若$a[i]=b[j]$，$dp(i,j)=max\,\{dp(i-1,j)-y, dp(i,j-1)-z, dp(i-1,j-1)+x-y-z, x-y-z\}$，即$a$串的长度加一或$b$串的长度加一或$a,b$串的长度都加一$(LCS(a,b)+1)$或丢弃前面的串$|a|=|b|=1$；
* 若$a[i]\neq b[j]$，$dp(i,j)=max(dp(i-1,j)-y,dp(i,j-1)-z,-y-z)$, 即a串长度加一或b串长度加一或丢弃前面的串$|a|=|b|=1$

遍历$i$，$j$得到$dp(n,m)$即为答案

~~~
for(int i =1;i<=n;i++)
	for (int j = 1; j <= m; j++) {
		if (A[i] != B[j])
			dp[i][j]=max(max(dp[i-1][j]-y,dp[i][j-1]-z),-y-z);
		else
			dp[i][j]=max(max(dp[i-1][j-1]+x-y-z,dp[i-1][j]-y),max(dp[i][j-1]-z,x-y-z));
~~~

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
const ll MOD = 924844033;
//const int N = 1e5 + 10;
int n, m;
char A[5010], B[5010];
ll x, y, z;
ll dp[5010][5010];
ll an;
void solve(){
	sii(n, m); siii(x, y, z);
	scanf("%s", A+1); scanf("%s", B+1);
	for(int i =1;i<=n;i++)
		for (int j = 1; j <= m; j++) {
			if (A[i] != B[j])
				dp[i][j] = max(max(dp[i - 1][j] - y, dp[i][j - 1] - z), -y - z), an = max(an, dp[i][j]);
			else
				dp[i][j] = max(max(dp[i - 1][j - 1] + x - y - z, dp[i - 1][j] - y), max(dp[i][j - 1] - z, x - y - z)), an = max(an, dp[i][j]);
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

