---
title: "暑期集训数学和计算几何"
date: 2022-3-1
categories: [Study, ACM]
tags: [Math , Geometry ,ACM]
math: true
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

```c++
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

# E. 兔儿爷

**题意**：给你三种药水，每种药水含有A物质$a_i$mg/l和B物质$b_i$mg/l，n次询问，每次询问是否可以用给定的三种药水调制出含A物质$x$mg/l和$y$mg/l的药水。

***

其实就是问(x,y)是否在($a_1,b_1$)，($a_2,b_2$)，($a_3,b_3$)组成三角形内或边上。这题合理的做法是用 toleft 检测，但由于写这题时还没学计算几何，所以用了向量解方程的方法来写。

设原来的三个点为A,B,C，询问的点为P，计算得到$\vec{AB}$，$\vec{AC}$，$\vec{AP}$，那么就可以设$\vec{AP}=u\vec{AB}+v\vec{AC}$，最后解出来的u和v，满足u>=0，v>=0，u+v<=1即可，同时需要特判一下在边上的情况。

***

```c++
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

# F. 多重和式

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

```c++
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

# H. 洛水神女

**题意**：$n$只猫猫，第$i$只猫猫在过生日的时候有$P_i$的概率死掉，问所有猫猫的期望寿命之和

***

第$i$年死掉的概率是$(1-P)^{i-1}P$，寿命期望即为$\sum_{i=1}^{\infty}(1-P)^{i-1}P(i-1)$，这里的$P$可以提出来，然后剩下的即为求一个幂级数的和函数。在微积分下册P244习题2(1)可以知道$\sum_{n=1}^{\infty}nx^n=\frac{x}{(1-x)^2}$，代入公式即可。

***

```c++
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
ll qpow(ll a, ll n){//快速幂
    ll cnt = 1;
    a %= MOD;
    while (n > 0){
        if (n & 1) cnt = (cnt * a) % MOD;
        a = (a * a) % MOD, n >>= 1;
    }
    return cnt;
}
ll inv(ll a){ return qpow(a, MOD - 2); }
pair<int, int> nextPair(int& x) {
    int a, b;
    x ^= x << 13; x ^= x >> 17; x ^= x << 5; x %= 10000000; a = x;
    x ^= x << 13; x ^= x >> 17; x ^= x << 5; x %= 10000000; b = x;
    b = max(b, 1); a = max(a % b, 1);
    return make_pair(a, b);
}
int n;
ll a[N], b[N];
void solve() {
    int x;
    sii(n, x);
    pair<int, int>tmp;
    for (int i = 1; i <= n; i++) {
        tmp = nextPair(x);
        a[i] = (ll)tmp.first;
        b[i] = (ll)tmp.second;
    }
    //die→ai/bi
    //age→P(sum{i*(1-P)^i})→(b-a)/a
    ll ans=0;
    for (int i = 1; i <= n; i++) {
        ll ttt = inv(a[i]);
        ans = (ans + (b[i]-a[i]) * ttt %MOD) % MOD;
    }
    printf("%lld", ans%MOD+n);
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

# N. 黑灰游戏 · 改

**题意**：$n$堆石子，每堆$a_i$个，玩家$A$、$B$轮流指定对方拿第$i$堆的石子，对方要拿至少1个石子，取走最后一个石子的胜利，判断谁胜。

***

1. 首先考虑最简单的情况，即所有的石子堆都只有1个石子，那么显然堆数为奇数时，第一个指定让对方拿石子的玩家必败，偶数时必胜。

2. 如果存在石子数不为1的石子堆，情况有些许变化。可以简单的情况模拟一下：

   设石子堆分别为1、1、2：

   A如果先让B拿石子数为1的石子堆，剩下的石子堆为1、2，此时B只要让A拿剩下那个石子数为1的石子堆，B就可以顺理成章的一口气拿完最后一堆；

   A如果先让B拿石子数位2的石子堆，B直接把石子拿完，剩下的石子堆为1、1，此时根据上面的结论，B已经胜利了。

   出现这种情况的原因是，玩家在拿一个石子数大于1的石子堆时，可以控制拿完或者拿的只剩1个，以此控制场上石子数为1的石子堆的奇偶性，多模拟一些情况就会发现，对于场上存在石子数大于1的石子堆的情况，石子数为1的石子堆数量为偶数时后指定的那位玩家必胜，反之必败。这种情况与上面的1.情况恰好相反。

***

```c++
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
int k;
void solve() {//         快读不能读负数啊！！！ 交互不能快读啊！！！╰(艹皿艹)
	si(n);
	int cnt = 0;
	for (int i = 1; i <= n; i++) {
		int tmp; si(tmp);
		if (tmp == 1)cnt++;
	}
	if (cnt == n) {
		if (cnt % 2)puts("Win");
		else puts("Lose");
		return;
	}
	if (cnt % 2)puts("Lose");
	else puts("Win");
}
int main() {
	int t;
	t = 1;
	si(t);
	while (t--)
		solve();
	return 0;
}
/*

*/
```

# W. 奥日与风袭废墟

**题意**：求500000内的$\varphi(i),\mu(i),\sigma_0(i),\sigma_1(i),f(i)=\sum_{i|n}\mu(i)\varphi(i)\sigma(\frac{n}{i})$

***

### 筛法

**线性筛**：对于积性函数$f$，如果$i$和$j$互质，就有$f(i \times j)=f(i) \times f(j)$，其他情况另作讨论

设$p_1$是$n$的最小质因子，${n'=\frac n p_1}$m，那么$n$会通过$n'\times p_1$筛掉$\varphi$：若$n'\,mod\,p_1=0$，$\varphi(n)=p_i\times\varphi(n')$；若$n' \,mod\, {p_1}\neq0$，$\varphi(n)=(p_1-1)\times\varphi(n')$

2. $\mu$：若$n'\,mod\, p_1=0$，$\mu(n)=1$；若$n'\,mod\, p_1 \neq 0$，$\mu(n)=-\mu(n')$
3. $\sigma_0$：利用结论$\sigma_{0}(i)=\prod_{i=1}^{m}{(c_{i}+1)}$
4. $\sigma_1$：利用结论$\sigma_{1}(A)=\prod_{i=1}^{n}(\sum_{j=0}^{c_{i}}p_{i}^{j})$
5. $f$：在处理$\sigma_0$时我们会得到一个辅助数组，记录了一个数的最小质因数的出现次数。设$n$最小质因数的出现次数为$t_1$：若$n'=p_1^{t_1}$，此时只需要暴力求解sum即可，只求和了$t_1$个数；若$n'\neq{p_1^{t_1}}$，根据积性函数的性质，有$f(n)=f(\frac {n'} {p_1^{t_1}}) \times f(p_1^{t_1+1})$，就是把原来的两个数重新拆分组合成俩个互质的数，然后就可以直接乘起来了。

***

```c++
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
//prime→质数，phi→欧拉，mu→莫比乌斯，is_cop→标记为合数
int prime[N], phi[N], mu[N], is_cop[N];
//p_num[i]→i最小质数出现次数，pk_sum[i]→i最小质因子的\sum_{i=0}^{k}{p^i}
//sigm0→σ0，sigm1→σ1
int p_num[N], pk_sum[N], sigm0[N], sigm1[N], f[N];
int ttt = 0;
int qpow(int a, int n) {//快速幂
	int cnt = 1;
	while (n > 0) {
		if (n & 1) cnt *= a;
		a *= a, n >>= 1;
	}
	return cnt;
}
void init() {
	int cnt = 0;
	phi[1] = mu[1] = sigm0[1] = sigm1[1] = pk_sum[1] = 1, f[1]=1;
	for (int i = 2; i <= n; i++) {
		if (!is_cop[i]) {//质数
			prime[++cnt] = i;
			phi[i] = i - 1;
			mu[i] = -1;
			sigm0[i] = 2;
			p_num[i] = 1;
			sigm1[i] = i + 1;
			pk_sum[i] = i + 1;
			f[i] = 2;
		}
		for (int j = 1; j <= cnt; j++) {
			int tmp = i * prime[j];
			if (tmp > n) break;
			is_cop[tmp] = 1;
			if (i % prime[j] == 0) {//因为是prime，所以为不互质
				//printf("%d:%d*%d=%d\n", ++ttt, i, prime[j], i * prime[j]);
				phi[tmp] = phi[i] * prime[j];
				mu[tmp] = 0;
				p_num[tmp] = p_num[i] + 1;
				sigm0[tmp] = sigm0[i] / p_num[tmp] * (p_num[tmp] + 1);
				pk_sum[tmp] = 1 + pk_sum[i] * prime[j];
				sigm1[tmp] = sigm1[i] / pk_sum[i] * pk_sum[tmp];
				int X = i / qpow(prime[j], p_num[i]);
				if (X == 1) {
					int cao = 1;
					for (int i = 1; i <= p_num[i] + 1; i++, cao*=prime[j])
						f[tmp] += mu[cao] * phi[cao] * sigm1[tmp / cao];
				}
				else 
					f[tmp] = f[X] * f[qpow(prime[j], p_num[i] + 1)];
			//	for (int k = 1; k <= tmp; k++)
				//	if (tmp % k == 0)f[tmp] += mu[k] * phi[k] * sigm1[tmp / k];
				break;
			}
			phi[tmp] = phi[i] * phi[prime[j]];
			mu[tmp] = mu[i] * mu[prime[j]];
			p_num[tmp] = 1;
			sigm0[tmp] = sigm0[i] * sigm0[prime[j]];
			pk_sum[tmp] = 1 + prime[j];
			sigm1[tmp] = sigm1[i] * sigm1[prime[j]];
			f[tmp] = f[i] * f[prime[j]];
		}
	}
}
void solve() {
	si(n);
	init();
	for (int i = 1; i <= n; i++) printf("%d ", phi[i]);
	printf("\n");
	for (int i = 1; i <= n; i++)printf("%d ", mu[i]);
	printf("\n");
	for (int i = 1; i <= n; i++)printf("%d ", sigm0[i]);
	printf("\n");
	for (int i = 1; i <= n; i++)printf("%d ", sigm1[i]);
	printf("\n");
	for (int i = 1; i <= n; i++)printf("%d ", f[i]);

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

# Z. Жизнь по кругу 

**题意**：圆心在原点，半径为$r$的圆经过多少整数点。$1\leq{r}\leq{1e18}$

***

### Pollard Rho & Miller Rabin

由视频BV1kx411q7kK有，对于一个半径为$r$的圆，首先我们算得$r^2$的所有因数，对于因数$i$，若$i$为偶数，$ans$不变；若$i$模4余1，$ans++$；若$i$模4余3，$ans--$，最后$ans*=4$即为答案。

但对于本题1e18的数据范围显然直接这样解是不合理的。

将$r$分解得到的素数里，$4k+3$类型为高斯素数，这东西因为无法拆成共轭的两个因子的乘积，它的出现次数必须为2的倍数，否则在分配因子的时候就会不知所去。

设$p$为$4k+1$的素数，$q$为$4k+3$的素数，则$r=2^n\prod_{q_i=4k+3}q_i^{m_i}\prod_{p_j=4k+1}p_j^{k_j}$

我们需要的是$r^2$，所以有$r^2=2^{2n}\prod_{q_i=4k+3}q_i^{2m_i}\prod_{p_j=4k+1}p_j^{2k_j}$

会发现每个高斯素数的出现次数都是2的倍数，因此可以直接不管了，2这个素数对答案也没有贡献，于是最终答案变成这样：$ANS=4\prod_{p_j=4k+1}(2k_j+1)$

也就是说，我们要干的是把$r$的所有质因子提取出来，处理其中$4k+1$类型的即可

现在从最开始需要处理$1e36$的数据变成处理$1e18$，普通找质因子的复杂度是$O(\sqrt{n})$，还是太慢，于是又要加上Pollard Rho算法和Miller Rabin算法，用Pollard Rho找因数，Miller Rabin算法判断是否为素数，递归+map记录质因数的出现次数，最后统计答案，复杂度为$O(n^{\frac{1}{4}})$

***

```c++
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
ll ans;
map<ll, ll>cao;
inline ll ksc(ll a, ll b) {
	ll ans = 0;
	while (b != 0) {
		if (b & 1 != 0) ans += a;
		a += a, b >>= 1;
	}
	return ans;
}
ll qpow(ll a, ll n, ll MMM) {
	ll cnt = 1;
	while (n > 0) {
		if (n & 1) cnt = (__int128)cnt * a % MMM;
		a = (__int128)a * a%MMM, n >>= 1;
	}
	return cnt;
}
bool if_Pri(ll x) {//Miller Rabin素性测试
	if (x == 2)return true;
	if (x % 2 == 0 || x == 1)return false;
	ll a = x - 1, b = 0;
	int test_ = 10;//测试次数
	while (a % 2 == 0)a >>= 1, b++;
	for (int i = 1, flag; i <= test_; i++) {
		ll y = (ll)rand() % (x - 2) + 2, z = qpow(y, a, x);
		if (z == 1 || z == x - 1)continue;
		flag = 1;
		for (int j = 0; j < b; j++) {
			z = (__int128)z * z % x;
			if (z == x - 1) { flag = 0; break; }
		}
		if (flag)return false;
	}
	return true;
}
ll P_R(ll x) {//Pollard Rho+倍增，每2^k-1=127个数判断一次
	ll s = 0, t = 0, c = rand() % (x - 1) + 1, val = 1, tmp;
	int step, target;
	for (target = 1;; target <<= 1) {
		s = t, val = 1;
		for (step = 1; step <= target; step++) {
			t = ((__int128)t * t + c) % x, val = (__int128)val * abs(t - s) % x;
			if (step % 127 == 0) 
				if ((tmp = gcd(x, val)) > 1)return tmp;
		}
		if ((tmp = gcd(x, val)) > 1)return tmp;
	}
}
void F(ll now, ll cnt) {
	if (now == 1)return;
	if (if_Pri(now)) {
		if (now % 4 == 1)cao[now] += cnt;
		return;
	}
	ll tmp = now, cnt2 = 0;
	while (tmp >= now)tmp = P_R(now);
	while ((now % tmp) == 0)now /= tmp, cnt2++;
	F(now, cnt), F(tmp, cnt * cnt2);
}
void solve() {//         快读不能读负数啊！！！ 交互不能快读啊！！！╰(艹皿艹)
	ll r;
	ans = 1;
	cao.clear();
	si(r);
	if (r == 1) {
		printf("4\n");
		return;
	}
	F(r, 1);
	for (auto it : cao)
		ans *= it.second << 1 | 1;
	printf("%lld\n", 4 * ans);
}
int main() {
	int t;
	t = 1;
	si(t);
	while (t--)
		solve();
	return 0;
}
/*
1231243423432548618
900000000000000023
*/
```

