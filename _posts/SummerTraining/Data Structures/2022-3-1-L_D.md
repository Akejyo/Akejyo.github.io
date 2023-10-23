---
title: "gamers的众数"
date: 2022-3-1
tags:
  - Data Structures
  - ACM课程
---

分块

<!-- more -->

# L. gamers的众数 

**题意**：给定一个长为n的数列，n次询问[L,R]内的最小众数。

### 分块思想

***

**算法流程**：将数据分成块（长度$n^\frac 1 2$能达到最优），预先处理每一块内的数据。对[L,R]上的询问可以分成两类：1.完全占满块的部分 2.多出来的，没有占满块的部分。对于第一类，因为已经预处理了所以就直接拿来用，对于第二类采用暴力处理~~反正也不多~~

**细节处理：**

1. 考虑到数组里的数据范围是$-2^{31}$到$2^{31-1}$，这么大的数据想开数组做记录是开不动的，但是发现n的范围是1到$10^5$，也就是说不同类的数字最多$10^5$，开数组完全做的到，于是就有了**数据离散化**

* 数据离散化：

  对于数据大小很离谱的数组a，先将a数组复制到b数组，对b数组排序，用a[i]在b中的下标来代替a[i]，此时a数组的数据大小就合理了且不影响处理。

2. [L,R]区间内的众数，只有两种情况，要么是已处理块上的众数，要么是两边多出来的的区间上的某个数。那么就又出现了一个问题：如何知道一个数x在[L,R]区间上的出现次数？

* 查询x在区间[L,R]上的出现次数：

  * 前缀和：和A题一样，要预处理，对于本题的数据范围太离谱。

  * 指针操作：开一个vector<int> C[N]，其中C[i]里记录的是i在原数组里依次出现的下标。那么x在[L,R]的出现次数就是x在该区间第一次出现的位置在C[x]里对应的位置（用指针）减去在改区间里最后一次出现的位置在C[x]里对应的位置。

    ```
    int gettimes(int x, int l, int r) { return upper_bound(C[x].begin(), C[x].end(), r) - lower_bound(C[x].begin(), C[x].end(), l); }
    ```

### 回滚莫队

***

**莫队：**~~优雅的暴力~~，离线操作，先对询问的区间进行排序后再依次处理。

对于本题，当询问区间变大时很容易就能判断众数是否改变，但缩小区间就非常困难。因此，我们控制莫队的区间只变大不变小。对于莫队的左右指针，左指针控制在分块的右端点+1，这样在该区块里左指针一定是往区间增大的方向走，走完之后进行回滚操作，即把左指针再滚回右端点+1的位置。右指针因为排序的缘故能保证一直增就无所谓了。

***

```
#include <bits/stdc++.h>
#include <unordered_map>
using namespace std;
//#pragma GCC optimize(2)
#define si(a) scanf("%d",&a)
#define sii(a,b) scanf("%d%d",&a,&b)
#define siii(a,b,c) scanf("%d%d%d",&a,&b,&c)
#define fl float
#define ll long long int
#define ull unsigned long long int
int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
int jd(int a) { return a < 0 ? (a * -1) : a; }
const ll MOD = 998244353;
//int fa[5000100];
//inline signed gf(int x) { return fa[x] == x ? x : fa[x] = gf(fa[x]); }
int n, len,  M_times, lit, rit;//M_num记录数字，M_times记录数量，lit左游标，rit右游标
int M_num;
int a[100010], a_c[100010];//克隆数组
int ans[100010], cut[100010];
int zhong[5010][5010];
unordered_map<int, int> LS;//离散map
vector<int> cx[100010];//出现的次序
int get_th(int x) { return (x - 1) / len + 1; }//获得所属的块
int gettimes(int x, int l, int r) { return upper_bound(cx[x].begin(), cx[x].end(), r) - lower_bound(cx[x].begin(), cx[x].end(), l); }
void update(int x) {//加
	if (cut[x] > M_times) 
		M_times = cut[x], M_num = x;
	else if (cut[x] == M_times)
		M_num = min(M_num, x);
}
void update2(int x,int nn) {
	if (x > M_times) 
		M_times = x, M_num = nn;
	else if (x == M_times)
		M_num = min(M_num, nn);
}
void lisanhua() {//离散化
	sort(a_c + 1, a_c + 1 + n);
	for (int i = 1; i <= n; i++)
		LS[a_c[i]] = i;
	for (int i = 1; i <= n; i++)
		a[i] = LS[a[i]];
	for (int i = 1; i <= n; i++)
		cx[a[i]].push_back(i);
}
void QAQ(int N) {
	for (int i_an = 1; i_an <= N; i_an++) {
		int l, r; sii(l, r);
		int lth = get_th(l), rth = get_th(r);
		M_times = -1;
		if (lth == rth) {
			memset(cut, 0, sizeof(cut));
			for (int i = l; i <= r; i++)
				cut[a[i]]++, update(a[i]);
		}
		else {		
			int lm = lth * len, rm = (rth -1)* len+1, tem;
			for (int i = l; i <= lm; i++) 
				tem = gettimes(a[i], l, r), update2(tem, a[i]);
			for (int i = rm; i <= r; i++) 
				tem = gettimes(a[i], l, r), update2(tem, a[i]);
			if (lth + 1 <= rth - 1)
				tem = gettimes(zhong[lth + 1][rth - 1], l, r), update2(tem, zhong[lth + 1][rth - 1]);
		}
		printf("%d\n", a_c[M_num]);
	}
}
void solve() {
	si(n);
	for (int i = 1; i <= n; i++)
		si(a[i]), a_c[i] = a[i];
	lisanhua();
	len = (int)sqrt((double)n);//分块区间长度
	int nb = n / len;
	for (int i = 1; i <= nb; i++, memset(cut, 0, sizeof(cut))) {
		M_times = -1;
		for (int j = i; j <= nb; j++) {
			int tem = j * len;
			for (int k = (j - 1) * len + 1; k <= tem; k++)
				cut[a[k]]++, update(a[k]);
			zhong[i][j] = M_num;
		}
	}
	QAQ(n);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
```

