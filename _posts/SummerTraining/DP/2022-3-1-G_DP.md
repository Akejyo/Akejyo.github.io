---
title: "魔法少女2"
date: 2022-3-1
tags:
  - DP
  - ACM课程
---

刚体（图暂时寄了

<!-- more -->

# G.魔法少女2

**题意**: 添加对角线使一个n*m的矩阵变成**刚体**，求加对角线的方案数。

刚体的定义：如果该图无法只改变其中一部分的形状，而使得余下的部分的形状保持不变。比如：对于一个2*3的矩阵，没加对角线的时候可以随意变化形状（各边的长度都没变，线也没变弯）。

![1653045719747](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045719747.png)

加对角线后：下面的几种图都是一种刚体

![1653045737202](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045737202.png)

***

**分析**: 发现每加一个对角线，会确定一系列边的垂直/平行关系。 如：对于一个1*2的矩阵 

![1653045788242](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045788242.png)可以随意变换![1653045816023](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045816023.png)

添加一条对角线后，其变换能力受到了部分约束，且**红色边**与**蓝色边**将永远保持垂直关系

![1653045883724](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045883724.png)

对应到原矩阵即为**第一列的横边与第一行的竖边保持垂直**。

我们发现刚体其实就是所有的横边与竖边都垂直，我们已经连了一条对角线使得一行的竖边与一列的横边垂直，再连一条就能让所有横边都垂直竖边

![1653045906226](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045906226.png)

我们已经知道了连一条对角线的效果是让某一行的竖边与某一列的横边互相垂直，那么就可以转化成二分图问题。二分图左边是行，右边是列，**矩阵变为刚体的情况即为二分图联通的情况**。

![1653045943045](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045943045.png)

都是二分图联通情况

现在我们就把问题转化成了：

**一个左边n个点，右边m个点的二分图**，**使其联通的连线方案数有多少**

直接去算联通数：容易出现算重复的情况，所以采用算出**所有的连线情况减去不连通的连线方案**的方式

![1653045993063](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1653045993063.png)

~~~
for(n = 0;n<=N;n++)
		for (m = 0; m <= M; m++) {//求左边n个点右边m个点的二分图的联通方案数量
			dp[n][m] = three_mi[n * m];//这是所有连接情况，后面穷举不连通的减去
			for (int i = 0; i <= n - 1; i++) {
				for (int j = 0; j <= m; j++)
					if (i != n - 1 || j != m) {//i和j不能同时取到最大值
						dp[n][m] -= (C[n - 1][i] * C[m][j] % MOD * three_mi[(n - i - 1) * (m - j)] % MOD * dp[i + 1][j]) % MOD;
						dp[n][m] %= MOD;
					}
			}
			dp[n][m] = (dp[n][m] + MOD) % MOD;
		}
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
int N, M;
ll C[110][110];//C(i,j)排列数
ll dp[110][110];
ll three_mi[11000];
void C_i_j() {//预处理C(i,j)
	for (int i = 0; i <= 105; i++) {
		C[i][0] = 1, C[i][i] = 1;
		for (int j = 1; j < i; j++)
			C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
	}
}
void three_x() {//预处理3^x
	three_mi[0] = 1;
	for (int i = 1; i <= 10100; i++) three_mi[i] = (three_mi[i - 1]) * 3 % MOD;
}
void solve() {
	sii(N, M);
	C_i_j(); three_x();
	for(n = 0;n<=N;n++)
		for (m = 0; m <= M; m++) {//求左边n个点右边m个点的二分图的联通方案数量（该题里每个点的情况有3种
			dp[n][m] = three_mi[n * m];//这是所有连接情况，后面穷举不连通的减去
			for (int i = 0; i <= n - 1; i++) {
				for (int j = 0; j <= m; j++)
					if (i != n - 1 || j != m) {//i和j不能同时取到最大值
						dp[n][m] -= (C[n - 1][i] * C[m][j] % MOD * three_mi[(n - i - 1) * (m - j)] % MOD * dp[i + 1][j]) % MOD;
						dp[n][m] %= MOD;
					}
			}
			dp[n][m] = (dp[n][m] + MOD) % MOD;//取余，不然会寄
		}
	printf("%lld", dp[N][M]);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}

```

