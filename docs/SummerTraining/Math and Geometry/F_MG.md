---
title: "多重和式"
date: 2022-3-1
tags:
  - Math
  - ACM课程
---

莫比乌斯反演

<!-- more -->

# F.多重和式

**题意**：求 $\sum_{i=1}^n\sum_{j=1}^mlcm(i,j)[gcd(i,j)\leq{a}]$

***

推式子：先考虑没有后面那个gcd条件的情况

$\sum_{i=1}^n\sum_{j=1}^{m}lcm(i,j)$

=$\sum_{i=1}^n\sum_{j=1}^m\frac{i*j}{gcd(i,j)}$

枚举gcd(i,j)=d

$=\sum_{d=1}^{min(n,m)}\sum_{i=1}^n\sum_{j=1}^{m}\frac{i*j}{d}[gcd(i,j)==d]$

这里把$i$换成$i*d$，$j$换成$j*d$，可以得到

$=\sum_{d=1}^{min(n,m)}\sum_{i=1}^{\lfloor\frac{n}{d}\rfloor}\sum_{j=1}^{\lfloor\frac{m}{d}\rfloor}{i*j*d}[gcd(i,j)==1]$

右边的两个sum可以分块解决，所以单独拿出来，设：

$sum(n,m)=\sum_{i=1}^{n}\sum_{j=1}^{m}{i*j*d}[gcd(i,j)==1]$

根据莫比乌斯函数的结论有

$=\sum_{i=1}^{n}\sum_{j=1}^{m}\sum_{d|gcd(i,j)==1}\mu(d){i*j}$

还是枚举因数$d$

$=\sum_{d=1}^{min(n,m)}\sum_{d|i}^n\sum_{d|j}^m\mu(d){i*j}$

然后再和上面一样处理$i$和$j$，得到

$=\sum_{d=1}^{min(n,m)}\mu(d)d^2\sum_{i=1}^{\lfloor\frac{n}{d}\rfloor}\sum_{j=1}^{\lfloor\frac{m}{d}\rfloor}{i*j}$

然后可以看到右边那俩个sum是可以O(1)解得的，左边的sum在预处理后也可以直接得到，最后回到原式子，利用数论分块即可求解

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
const int N = 1e7 + 10;
//int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
ll mu[N], mu_d2[N], prime[N];
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int mark[N];
void init(int n) {//初始化mu[i]*i^2的前缀和
	for (int i = 1; i <= n; i++)
		mu_d2[i] = (mu_d2[i - 1] + (ll)i * (ll)i % MOD * (mu[i] + MOD)%MOD) % MOD;
}
void Mobius(int n) {//筛莫比乌斯函数
	int cnt = 0;
	mu[1] = 1;
	for (int i = 2; i <= n; i++) {
		if (!mark[i])
			mu[i] = -1, prime[++cnt] = i;
		for (int j = 1; j <= cnt; j++) {
			if (i * prime[j] > n)break;
			mark[i * prime[j]] = 1;
			if (i % prime[j] == 0) {//i*prime[j]有平方因子→0
				mu[i * prime[j]] = 0;
				break;
			}
			mu[i * prime[j]] = -1 * mu[i];
		}
	}
}
ll g_(ll n, ll m) { return n * (n + 1)  / 2 % MOD * (m * (m + 1) / 2 % MOD) % MOD; }
ll sum(ll n, ll m) {
	ll cnt = 0, d, r;
	ll N = min(n, m);
	for (d = 1; d <= N; d = r + 1) {//d | i && d | j
		r = min(n / (n / d), m / (m / d));//分块右边界
		ll tmp = (ll)(mu_d2[r] - mu_d2[d - 1] + MOD);//一段mu[d]*d^2的和
		tmp = tmp * g_((ll)(n / d), (ll)(m / d)) % MOD;
		cnt = (cnt + tmp) % MOD;
	}
	return cnt;
}
void solve() {
	int n, m, a;
	siii(n, m, a);
	int ran = min(n, min(m, a));
	ll ans = 0;
	int r;
	Mobius(min(n, m));
	init(min(n, m));
	for (int d = 1; d <= ran; d = r + 1) {
		r = min(n / (n / d), min(ran/(ran/d),m / (m / d)));
		ll tmp = sum((ll)(n / d), (ll)(m / d));
		ans += (ll)(d + r) * (ll)(r - d + 1) / 2LL % MOD * tmp%MOD;
		ans %= MOD;
	}
	printf("%lld", ans);
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

