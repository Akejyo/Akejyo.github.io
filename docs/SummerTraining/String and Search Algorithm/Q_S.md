---
title: "接头暗号"
date: 2022-3-1
tags:
  - String
  - ACM课程
---

KMP

<!-- more -->

# Q. 接头暗号 

**题意**： 给定一个文本t和一个字符串s，求t中s的出现次数。

***

### KMP

首先要了解**前缀函数**：给定一个长度为$n$的字符串 ，其前缀函数被定义为一个长度为$n$的数组$\pi$。其中$\pi[i]$是子串$s[0...i]$最长的相等的真前缀与真后缀的长度。

那么，计算π[i]的朴素算法显然就是不停的扫，时间复杂度为$O(n^3)$。可以发现，每次读入一个字符时，如果$\pi[i+1]=\pi[i]+1$，那么就有$s[i+1]=s[\pi[i]]$（数组从0开始），也就是说，会出现下面的情况：

> 图来自OI Wiki

![1654948553854](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1654948553854.png)

那如果$s[i+1]\neq s[\pi[i]]$如何去找呢？我们还会发现，对于子串$s[0...i]$，首先有$s[0...\pi[i]]=s[i-\pi[i]+1...i]$，然后就会发现，这两个小子串完全一致就会导致前面那个小子串$s[0...\pi[i]]$的前缀性质会保留到后一个小子串$s[i-\pi[i]+1..i]$，也就是$s[0...\pi[i]]$又会有一个前缀和$s[i-\pi[i]+1..i]$的后缀相等，而这个前缀/后缀的长度显然就是$\pi[\pi[i]]$，就是下面图所示：

> 图还是来自OI Wiki

![1654948993596](C:\Users\张少禹\AppData\Roaming\Typora\typora-user-images\1654948993596.png)

所以在失配的时候就可以不停的跳π[i]来找相等的前缀，时间复杂度为$O(n)$

回到$KMP$，将字符串$s$和文本$t$拼接起来，中间用一个两者都没有的字符（如'#'）隔开，然后跑前缀函数即可。

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
const int N = 5e5 + 10;
int n, m;
char s[5000000];
char t[5000010];
int ans;
int pi[5000010];
void solve() {
	scanf("%s", s);
	scanf("%s", t);
	int cao = strlen(t);
	t[cao] = '#';
	strcat(t, s);
	int len = strlen(t);
	for (int x = 1; x < len; x++) {
		int y = pi[x - 1];
		while (y > 0 && t[x] != t[y])
			y = pi[y - 1];
		if (t[x] == t[y])
			y++;
		pi[x] = y;
		if (pi[x] == cao)
			ans++;
	}
	printf("%d", ans);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
/*
3
what
is
mind
thisisnotmind
*/
```

